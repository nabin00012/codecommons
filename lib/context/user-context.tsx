"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { authService } from "@/lib/services/auth";
import { useAuth } from "./AuthContext";
import { useRouter, usePathname } from "next/navigation";
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

const defaultPreferences = {
  theme: "system",
  notifications: true,
  language: "en",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { token, setToken } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const verificationInProgress = useRef(false);
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
            // Only redirect to login if not on auth pages
            if (!isAuthPage) {
              router.replace("/login");
            }
          }
          return;
        }

        // Prevent multiple simultaneous verifications
        if (verificationInProgress.current) {
          return;
        }

        verificationInProgress.current = true;
        const response = await authService.verifyToken(token);
        verificationInProgress.current = false;

        if (mounted) {
          if (response?.user) {
            const userData = {
              id: response.user._id,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role as UserRole,
              avatar:
                response.user.avatar || "/placeholder.svg?height=40&width=40",
              preferences: response.user.preferences || defaultPreferences,
            };
            setUser(userData);

            // Set theme if user has a preference
            if (
              userData.preferences?.theme &&
              userData.preferences.theme !== resolvedTheme
            ) {
              setTheme(userData.preferences.theme);
            }

            // If on auth page and user is verified, redirect to dashboard
            if (isAuthPage) {
              router.replace("/dashboard");
            }
          } else {
            setUser(null);
            setToken(null);
            setLoading(false);
            // Only redirect to login if not on auth pages
            if (!isAuthPage) {
              router.replace("/login");
            }
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        if (mounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
          // Only redirect to login if not on auth pages
          if (!isAuthPage) {
            router.replace("/login");
          }
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
  }, [token, router, setToken, resolvedTheme, setTheme, pathname, isAuthPage]);

  const login = (userData: User) => {
    const userWithPreferences = {
      ...userData,
      preferences: userData.preferences || defaultPreferences,
    };
    setUser(userWithPreferences);

    // Set theme if user has a preference
    if (userWithPreferences.preferences?.theme) {
      setTheme(userWithPreferences.preferences.theme);
    }

    // Redirect to dashboard after successful login
    router.replace("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.replace("/login");
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
