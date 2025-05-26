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
      console.log("Login response:", data); // Add logging to debug response

      // Ensure the response has the required fields
      if (
        !data ||
        !data._id ||
        !data.name ||
        !data.email ||
        !data.role ||
        !data.token
      ) {
        throw new Error("Invalid response structure from server");
      }

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

  async verifyToken(token: string): Promise<AuthResponse | null> {
    try {
      console.log("Verifying token:", token.substring(0, 20) + "..."); // Log partial token for debugging

      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Token verification failed: ${response.status} ${response.statusText}`;

        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textError = await response.text();
            errorMessage = textError || errorMessage;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }

        console.error("Token verification failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
        });

        this.setToken(null); // Clear invalid token
        return null;
      }

      const data = await response.json();
      console.log("Token verification response:", data);

      // Validate response structure
      if (!data || typeof data !== "object") {
        console.error("Invalid response: not an object", data);
        this.setToken(null);
        return null;
      }

      // Check if the response has a user object
      if (data.user) {
        // If response has a user object, validate its structure
        if (
          !data.user._id ||
          !data.user.name ||
          !data.user.email ||
          !data.user.role
        ) {
          console.error(
            "Invalid user object: missing required fields",
            data.user
          );
          this.setToken(null);
          return null;
        }

        // Create response from user object
        const authResponse: AuthResponse = {
          token: token,
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

        this.lastVerificationTime = Date.now();
        return authResponse;
      } else {
        // If response has fields at root level, validate them
        if (!data._id || !data.name || !data.email || !data.role) {
          console.error("Invalid response: missing required fields", data);
          this.setToken(null);
          return null;
        }

        // Create response from root level fields
        const authResponse: AuthResponse = {
          token: token,
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

        this.lastVerificationTime = Date.now();
        return authResponse;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      this.setToken(null); // Clear invalid token
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
