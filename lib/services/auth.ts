import { UserRole } from "@/lib/context/user-context";

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
  token?: string;
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
    try {
      if (this.token) {
        console.log("Getting token from memory");
        return this.token;
      }

      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        console.log(
          "Getting token from localStorage:",
          storedToken ? "exists" : "none"
        );
        if (storedToken) {
          this.token = storedToken;
          return storedToken;
        }
      }

      return null;
    } catch (error) {
      console.error("AuthService - Error getting token:", error);
      return null;
    }
  }

  setToken(token: string | null): void {
    console.log("Setting token:", token ? "exists" : "null");
    this.token = token;

    if (token) {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          // Set cookie without secure flag for local development
          document.cookie = `token=${token}; path=/; samesite=lax; max-age=2592000`; // 30 days
          console.log("Token set in cookie and localStorage");
        }
      } catch (error) {
        console.error("AuthService - Error setting token:", error);
      }
    } else {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // Clear cookie
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          console.log("Token removed from cookie and localStorage");
        }
      } catch (error) {
        console.error("AuthService - Error removing token:", error);
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
      console.log("Attempting login with:", credentials.email);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const data = (await response.json()) as LoginResponse;
      console.log("Login response:", data);

      if (!data._id || !data.token) {
        throw new Error("Invalid login response");
      }

      // Set token before returning response
      this.setToken(data.token);
      console.log("Token set after successful login");

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
        token: data.token,
      };
    } catch (error) {
      console.error("Login error:", error);
      this.setToken(null);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse | null> {
    try {
      console.log("Attempting registration with:", data.email);
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }

      const responseData = (await response.json()) as LoginResponse;
      console.log("Registration response:", responseData);

      if (!responseData._id || !responseData.token) {
        throw new Error("Invalid registration response");
      }

      // Set token before returning response
      this.setToken(responseData.token);
      console.log("Token set after successful registration");

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
        token: responseData.token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      this.setToken(null);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<{ success: boolean; user?: any }> {
    try {
      console.log("Verifying token...");
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Token verification failed");
        return { success: false };
      }

      const data = await response.json();
      console.log("Token verification response:", data);
      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      return { success: false };
    }
  }

  logout(): void {
    console.log("Logging out...");
    this.setToken(null);
  }
}

export const authService = new AuthService();
