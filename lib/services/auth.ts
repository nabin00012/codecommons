import { API_URL } from "@/lib/constants";

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  success?: boolean;
}

class AuthService {
  private token: string | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
    this.token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log(
      "AuthService initialized with token:",
      this.token ? "exists" : "none"
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data as T;
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Attempting login for:", email);
      const response = await this.request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.token || !response.user) {
        throw new Error("Invalid response from server");
      }

      this.token = response.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Invalid email format");
      }

      // Validate password strength
      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      console.log("Attempting registration for:", data.email);
      const response = await this.request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.token || !response.user) {
        throw new Error("Invalid response from server");
      }

      this.token = response.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error && error.message.includes("already exists")) {
        throw new Error(
          "An account with this email already exists. Please try logging in instead."
        );
      }
      throw error;
    }
  }

  async verifyToken(): Promise<User> {
    if (!this.token) {
      throw new Error("No token found");
    }

    try {
      console.log("Verifying token...");
      const response = await this.request<{ user: User }>("/auth/verify", {
        method: "GET",
      });

      if (!response.user) {
        throw new Error("Invalid user data");
      }

      return response.user;
    } catch (error) {
      console.error("Token verification error:", error);
      this.clearToken();
      throw error;
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
