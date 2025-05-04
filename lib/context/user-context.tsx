"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "student" | "teacher"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (userData: Partial<User>) => void
  logout: () => void
  switchRole: (role: UserRole) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on initial render
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("codecommons_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = (userData: Partial<User>) => {
    // Create a new user with default values for missing fields
    const newUser: User = {
      id: userData.id || Math.random().toString(36).substring(2, 9),
      name: userData.name || "User",
      email: userData.email || "user@example.com",
      role: userData.role || "student",
      avatar: userData.avatar || "/placeholder.svg?height=40&width=40",
    }

    setUser(newUser)
    localStorage.setItem("codecommons_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("codecommons_user")
  }

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem("codecommons_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, switchRole, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
