"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/lib/services/auth";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export type UserRole = "student" | "teacher" | "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  switchRole: (newRole: UserRole) => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User["preferences"]>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, setToken } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        console.log("Loading user...");
        if (!token) {
          console.log("No token found");
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const response = await authService.verifyToken(token);
        console.log("User verification response:", response);

        if (mounted && response.user) {
          setUser({
            id: response.user._id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            avatar:
              response.user.avatar || "/placeholder.svg?height=40&width=40",
            preferences: response.user.preferences,
          });
        } else if (mounted) {
          console.log("No user data in response");
          setUser(null);
          setToken(null);
          setLoading(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        if (mounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
          router.push("/login");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [token, router, setToken]);

  useEffect(() => {
    console.log("UserProvider - Theme changed:", resolvedTheme);
    if (user?.preferences.theme && user.preferences.theme !== resolvedTheme) {
      setTheme(user.preferences.theme);
    }
  }, [resolvedTheme, user?.preferences.theme, setTheme]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const updatePreferences = (preferences: Partial<User["preferences"]>) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            preferences: { ...prev.preferences, ...preferences },
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        logout,
        isLoading: loading,
        switchRole,
        updateUser,
        updatePreferences,
      }}
    >
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
