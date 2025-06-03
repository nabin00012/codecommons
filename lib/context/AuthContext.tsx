"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  token: null,
  setToken: () => {},
  clearToken: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await authService.verifyToken(storedToken);
        if (response && response.token) {
          setIsAuthenticated(true);
          setTokenState(response.token);
        } else {
          throw new Error("Invalid token response");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsAuthenticated(false);
        setTokenState(null);
        localStorage.removeItem("token");
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [toast]);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    setIsAuthenticated(!!newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("token", newToken);
      } else {
        localStorage.removeItem("token");
      }
    }
  };

  const clearToken = () => {
    setTokenState(null);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        setToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
