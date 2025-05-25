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
    preferences?: {
      theme: string;
      notifications: boolean;
      language: string;
    };
  };
}

class AuthService {
  private token: string | null = null;
  private verificationPromise: Promise<AuthResponse> | null = null;
  private lastVerificationTime: number = 0;
  private readonly VERIFICATION_CACHE_TIME = 5000; // 5 seconds

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: Response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: AuthResponse = await response.json();
      this.token = data.token;
      localStorage.setItem("token", data.token);
      return data;
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response: Response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const responseData: AuthResponse = await response.json();
      this.token = responseData.token;
      localStorage.setItem("token", responseData.token);
      return responseData;
    } catch (error: unknown) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<AuthResponse> {
    const now = Date.now();

    // If we have a cached verification and it's still valid, return it
    if (
      this.verificationPromise &&
      now - this.lastVerificationTime < this.VERIFICATION_CACHE_TIME
    ) {
      return this.verificationPromise;
    }

    // Create a new verification promise
    this.verificationPromise = (async () => {
      try {
        const response: Response = await fetch(`${API_URL}/api/auth/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token verification failed");
        }

        const data: AuthResponse = await response.json();
        this.lastVerificationTime = now;
        return data;
      } catch (error: unknown) {
        console.error("Token verification error:", error);
        throw error;
      }
    })();

    return this.verificationPromise;
  }

  async updateTheme(theme: string): Promise<void> {
    try {
      const response: Response = await fetch(`${API_URL}/api/users/theme`, {
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
    } catch (error: unknown) {
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
