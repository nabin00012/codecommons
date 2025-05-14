import { UserRole } from "@/lib/context/user-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const url = `${API_URL}/api/auth/login`;
    console.log("Making login request to:", url);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token || !data._id || !data.name || !data.email || !data.role) {
        throw new Error("Invalid response format from server");
      }

      // Store token in localStorage
      this.setToken(data.token);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<LoginResponse> {
    const url = `${API_URL}/api/auth/register`;
    console.log("Making register request to:", url);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Register response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (!data.token || !data._id || !data.name || !data.email || !data.role) {
        throw new Error("Invalid response format from server");
      }

      // Store token in localStorage
      this.setToken(data.token);

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout() {
    this.removeToken();
    window.location.href = "/login";
  },

  async verifyToken(token: string) {
    try {
      console.log("Verifying token...");
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Token verification response:", response.status);

      if (!response.ok) {
        console.error(
          "Token verification failed with status:",
          response.status
        );
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      console.log("Token verification data:", data);

      if (
        !data.user ||
        !data.user._id ||
        !data.user.name ||
        !data.user.email ||
        !data.user.role
      ) {
        throw new Error("Invalid user data in response");
      }

      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
        }
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },
};
