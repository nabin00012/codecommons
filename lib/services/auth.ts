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
    }
  }

  getToken(): string | null {
    try {
      if (this.token) {
        return this.token;
      }

      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
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
    this.token = token;
    if (token) {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      } catch (error) {
        console.error("AuthService - Error setting token:", error);
      }
    } else {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("AuthService - Error removing token:", error);
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
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
        throw new Error(errorData.message || "Login failed");
      }

      const data = (await response.json()) as LoginResponse;

      if (!data._id || !data.token) {
        throw new Error("Invalid login response");
      }

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
        throw new Error(errorData.message || "Registration failed");
      }

      const responseData = (await response.json()) as LoginResponse;

      if (!responseData._id || !responseData.token) {
        throw new Error("Invalid registration response");
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
        token: responseData.token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      this.setToken(null);
      throw error;
    }
  }

  async verifyToken(token: string | null): Promise<AuthResponse | null> {
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      this.setToken(null);
      return null;
    }
  }

  logout(): void {
    this.setToken(null);
  }
}

export const authService = new AuthService();
