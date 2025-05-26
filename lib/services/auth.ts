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
  private verificationPromise: Promise<AuthResponse | null> | null = null;
  private lastVerificationTime: number = 0;
  private readonly VERIFICATION_CACHE_TIME = 30000; // 30 seconds

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      return null;
    }

    // If there's an ongoing verification, wait for it
    if (this.verificationPromise) {
      const result = await this.verificationPromise;
      if (!result) {
        this.token = null;
        localStorage.removeItem("token");
        return null;
      }
      return this.token;
    }

    // Verify token if it's been more than 30 seconds since last verification
    const now = Date.now();
    if (now - this.lastVerificationTime > this.VERIFICATION_CACHE_TIME) {
      this.verificationPromise = this.verifyToken(this.token);
      try {
        const response = await this.verificationPromise;
        if (!response) {
          this.token = null;
          localStorage.removeItem("token");
          return null;
        }
        this.lastVerificationTime = now;
      } finally {
        this.verificationPromise = null;
      }
    }

    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    this.lastVerificationTime = 0; // Reset verification time when token changes
    this.verificationPromise = null; // Clear any ongoing verification
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
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login response:", data);

      // Create a properly structured response
      const authResponse: AuthResponse = {
        token: data.token,
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
          preferences: data.preferences || {
            theme: "light",
            notifications: true,
            language: "en",
          },
        },
      };

      // Set token before returning
      this.setToken(authResponse.token);
      return authResponse;
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
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const responseData: AuthResponse = await response.json();
      this.setToken(responseData.token);
      return responseData;
    } catch (error: unknown) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async verifyToken(token: string | null): Promise<AuthResponse | null> {
    try {
      if (!token || typeof token !== "string") {
        console.error("Invalid token format");
        return null;
      }

      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Token verification failed:", response.status);
        return null;
      }

      const data = await response.json();
      console.log("Token verification response:", data);

      if (!data || !data.user) {
        console.error("Invalid verification response");
        return null;
      }

      return {
        token,
        user: {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
          preferences: data.user.preferences || {
            theme: "light",
            notifications: true,
            language: "en",
          },
        },
      };
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  }

  async updateTheme(theme: string): Promise<void> {
    try {
      const token = await this.getToken();
      const response: Response = await fetch(`${API_URL}/api/users/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update theme");
      }
    } catch (error: unknown) {
      console.error("Theme update error:", error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    this.lastVerificationTime = 0;
    localStorage.removeItem("token");
  }
}

export const authService = new AuthService();
