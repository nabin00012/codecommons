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
  success: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    preferences?: {
      theme: string;
      notifications: boolean;
      language: string;
    };
  };
}

interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
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
      // Set token in cookies with appropriate options
      document.cookie = `token=${token}; path=/; max-age=${
        30 * 24 * 60 * 60
      }; SameSite=Lax`;
    } else {
      localStorage.removeItem("token");
      // Remove token from cookies
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    }
    this.lastVerificationTime = 0; // Reset verification time when token changes
    this.verificationPromise = null; // Clear any ongoing verification
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: `${API_URL}/api/auth/login`,
        });
        return null;
      }

      const data = (await response.json()) as LoginResponse;
      console.log("Login successful:", {
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
      });

      if (!data._id || !data.token) {
        console.error("Invalid login response:", data);
        return null;
      }

      // Store token in localStorage
      this.setToken(data.token);

      return {
        success: true,
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          preferences: data.preferences || {
            theme: "system",
            notifications: true,
            language: "en",
          },
        },
      };
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Registration failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: `${API_URL}/api/auth/register`,
        });
        return null;
      }

      const responseData = (await response.json()) as LoginResponse;
      if (!responseData._id || !responseData.token) {
        console.error("Invalid registration response:", responseData);
        return null;
      }

      this.setToken(responseData.token);

      return {
        success: true,
        user: {
          _id: responseData._id,
          name: responseData.name,
          email: responseData.email,
          role: responseData.role,
          preferences: responseData.preferences || {
            theme: "system",
            notifications: true,
            language: "en",
          },
        },
      };
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  }

  async verifyToken(token: string | null): Promise<AuthResponse | null> {
    if (!token || typeof token !== "string") {
      console.error("Invalid token format:", token);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Token verification failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: `${API_URL}/api/auth/verify`,
        });
        return null;
      }

      const data = await response.json();
      console.log("Token verification response:", data);

      // Handle both response formats
      const userData = data.user || data;
      if (!userData || !userData._id) {
        console.error("Invalid verification response:", data);
        return null;
      }

      return {
        success: true,
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          preferences: userData.preferences || {
            theme: "system",
            notifications: true,
            language: "en",
          },
        },
      };
    } catch (error) {
      console.error("Error verifying token:", error);
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
