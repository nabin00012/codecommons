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
        const storedToken = authService.getToken();
        if (!storedToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        await authService.verifyToken();
        setIsAuthenticated(true);
        setTokenState(storedToken);
      } catch (error) {
        console.error("Token verification error:", error);
        setIsAuthenticated(false);
        setTokenState(null);
        authService.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    setIsAuthenticated(!!newToken);
    if (typeof window !== "undefined" && newToken) {
      localStorage.setItem("token", newToken);
    }
  };

  const clearToken = () => {
    setTokenState(null);
    setIsAuthenticated(false);
    authService.clearToken();
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
