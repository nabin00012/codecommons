import { UserRole } from "@/lib/context/user-context";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    theme?: string;
  };
}

class AuthService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const responseData = await response.json();
      this.token = responseData.token;
      localStorage.setItem("token", responseData.token);
      return responseData;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  }

  async updateTheme(theme: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme");
      }
    } catch (error) {
      console.error("Theme update error:", error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("token");
  }
}

export const authService = new AuthService();
