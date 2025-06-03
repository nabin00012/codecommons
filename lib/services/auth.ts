import { UserRole } from "@/lib/context/user-context";
import { API_URL } from "@/lib/constants";

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
  user: {
    id: string;
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
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

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
      console.log(
        "AuthService initialized with token:",
        this.token ? "exists" : "none"
      );
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password strength
      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          role: data.role || "student",
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          responseData.message?.includes("already exists")
        ) {
          throw new Error(
            "An account with this email already exists. Please try logging in instead."
          );
        }
        throw new Error(
          responseData.message || "Registration failed. Please try again."
        );
      }

      if (!responseData.token || !responseData.user) {
        throw new Error("Invalid response from server");
      }

      this.setToken(responseData.token);
      return responseData;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<AuthResponse["user"]> {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token verification failed");
      }

      if (!data.user) {
        throw new Error("Invalid user data in response");
      }

      return data.user;
    } catch (error) {
      console.error("Token verification error:", error);
      this.clearToken();
      throw error;
    }
  }

  logout(): void {
    console.log("Logging out...");
    this.clearToken();
  }
}

export const authService = new AuthService();
