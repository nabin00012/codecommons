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
import { useToast } from "@/components/ui/use-toast";

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

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
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
  const { toast } = useToast();
  const verificationInProgress = useRef(false);
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const initialThemeSet = useRef(false);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
            if (
              !isAuthPage &&
              pathname &&
              pathname !== "/" &&
              !pathname.startsWith("/public")
            ) {
              router.replace("/login");
            }
          }
          return;
        }

        if (verificationInProgress.current) {
          return;
        }

        verificationInProgress.current = true;
        const response = await authService.verifyToken(token);
        verificationInProgress.current = false;

        if (mounted) {
          if (response?.success && response?.user) {
            const apiUser = response.user as ApiUser;
            const userData: User = {
              id: apiUser._id,
              name: apiUser.name,
              email: apiUser.email,
              role: apiUser.role as UserRole,
              avatar: apiUser.avatar || "/placeholder.svg?height=40&width=40",
              preferences: apiUser.preferences || defaultPreferences,
            };
            setUser(userData);

            if (!initialThemeSet.current && userData.preferences?.theme) {
              initialThemeSet.current = true;
              setTheme(userData.preferences.theme);
            }

            if (isAuthPage) {
              router.replace("/dashboard");
            }
          } else {
            console.log("Token verification failed, clearing user data");
            setUser(null);
            setToken(null);
            setLoading(false);
            toast({
              title: "Session expired",
              description: "Please log in again to continue.",
              variant: "destructive",
            });
            if (
              !isAuthPage &&
              pathname &&
              pathname !== "/" &&
              !pathname.startsWith("/public")
            ) {
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
          toast({
            title: "Authentication error",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          if (
            !isAuthPage &&
            pathname &&
            pathname !== "/" &&
            !pathname.startsWith("/public")
          ) {
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
  }, [token, router, setToken, pathname, isAuthPage, setTheme, toast]);

  const login = (userData: User) => {
    const userWithPreferences = {
      ...userData,
      preferences: userData.preferences || defaultPreferences,
    };
    setUser(userWithPreferences);

    if (userWithPreferences.preferences?.theme) {
      setTheme(userWithPreferences.preferences.theme);
    }

    router.replace("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.replace("/login");
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      toast({
        title: "Role updated",
        description: `Your role has been updated to ${newRole}.`,
      });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      return updatedUser;
    });
  };

  const updatePreferences = (preferences: Partial<User["preferences"]>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        preferences: { ...prev.preferences, ...preferences },
      };
      if (preferences.theme) {
        setTheme(preferences.theme);
      }
      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully.",
      });
      return updatedUser;
    });
  };

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
