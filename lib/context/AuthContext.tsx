"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/services/auth";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
  isLoading: true,
  verifyToken: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = async () => {
    try {
      if (!token) return false;

      const response = await authService.verifyToken(token);
      return !!response.user;
    } catch (error) {
      console.error("Token verification failed:", error);
      setTokenState(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          // Verify the token before setting it
          const response = await authService.verifyToken(storedToken);
          if (response.user) {
            setTokenState(storedToken);
            setIsAuthenticated(true);
          } else {
            setTokenState(null);
            setIsAuthenticated(false);
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setTokenState(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      setTokenState(newToken);
      setIsAuthenticated(true);
      localStorage.setItem("token", newToken);
    } else {
      setTokenState(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        isLoading,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
