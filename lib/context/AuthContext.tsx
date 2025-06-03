"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setToken: (token: string) => void;
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
    console.log("Initializing auth...");
    const storedToken = authService.getToken();
    console.log("Stored token:", storedToken ? "exists" : "none");

    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await authService.verifyToken(tokenToVerify);
      console.log("Token verification response:", response);

      if (response) {
        setTokenState(tokenToVerify);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid token response");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      console.log("Token verification failed, clearing token");
      clearToken();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const setToken = (newToken: string) => {
    authService.setToken(newToken);
    setTokenState(newToken);
    setIsAuthenticated(true);
  };

  const clearToken = () => {
    authService.clearToken();
    setTokenState(null);
    setIsAuthenticated(false);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
