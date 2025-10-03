"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export type UserRole = "student" | "teacher" | "user" | "admin";

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  section?: string;
  year?: string;
  specialization?: string;
  onboardingCompleted?: boolean;
  avatar?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser({
              id: data.user._id || data.user.id,
              _id: data.user._id || data.user.id,
              name: data.user.name || "",
              email: data.user.email || "",
              role: (data.user.role as UserRole) || "user",
              department: data.user.department || "",
              section: data.user.section || "",
              year: data.user.year || "",
              specialization: data.user.specialization || "",
              onboardingCompleted: data.user.onboardingCompleted ?? false,
              preferences: data.user.preferences,
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [mounted]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
