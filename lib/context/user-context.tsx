"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { authService, User } from "@/lib/services/auth";
import { useAuth } from "./AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "student" | "teacher" | "user" | "admin";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const defaultPreferences = {
  theme: "system",
  notifications: true,
  language: "en",
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
            setIsLoading(false);
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
        const userData = await authService.verifyToken();
        verificationInProgress.current = false;

        if (mounted) {
          if (userData) {
            const userWithPreferences: User = {
              ...userData,
              preferences: userData.preferences || defaultPreferences,
            };
            setUser(userWithPreferences);

            if (
              !initialThemeSet.current &&
              userWithPreferences.preferences?.theme
            ) {
              initialThemeSet.current = true;
              setTheme(userWithPreferences.preferences.theme);
            }

            if (isAuthPage) {
              router.replace("/dashboard");
            }
          } else {
            console.log("Token verification failed, clearing user data");
            setUser(null);
            setToken(null);
            setIsLoading(false);
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
          setIsLoading(false);
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
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [token, router, setToken, pathname, isAuthPage, setTheme, toast]);

  const login = (userData: User) => {
    const userWithPreferences: User = {
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

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...userData };
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
