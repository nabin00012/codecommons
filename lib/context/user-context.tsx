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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (session?.user) {
      const sessionUser = session.user as any;
      setUser({
        id: sessionUser.id || sessionUser._id,
        _id: sessionUser.id || sessionUser._id,
        name: sessionUser.name || "",
        email: sessionUser.email || "",
        role: (sessionUser.role as UserRole) || "user",
        preferences: sessionUser.preferences,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session, status]);

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
