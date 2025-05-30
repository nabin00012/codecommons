"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/services/auth";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getToken();
        if (storedToken) {
          const response = await authService.verifyToken(storedToken);
          if (response?.success) {
            setToken(storedToken);
          } else {
            // Token is invalid, clear it
            authService.setToken(null);
            setToken(null);
            toast({
              title: "Session expired",
              description: "Please log in again to continue.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        authService.setToken(null);
        setToken(null);
        toast({
          title: "Authentication error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [toast]);

  const login = async (newToken: string) => {
    try {
      const response = await authService.verifyToken(newToken);
      if (response?.success) {
        setToken(newToken);
        authService.setToken(newToken);
      } else {
        throw new Error("Token verification failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setToken(null);
      authService.setToken(null);
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
