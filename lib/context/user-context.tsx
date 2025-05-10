"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  switchRole: (newRole: UserRole) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  isLoading: true,
  switchRole: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUser({
              id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              avatar: data.avatar || "/placeholder.svg?height=40&width=40",
            });
          } else {
            // If token is invalid, clear it
            authService.logout();
            router.push("/login");
          }
        } catch (error) {
          console.error("Error loading user:", error);
          authService.logout();
          router.push("/login");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    router.push("/login");
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
    }
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
