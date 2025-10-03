import { API_URL } from "@/lib/constants";

interface User {
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

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${
      endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`
    }`;
    console.log("Making request to:", url);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("An account with this email already exists");
        }
        if (response.status === 400) {
          throw new Error(data.message || "Invalid input data");
        }
        if (response.status === 500) {
          throw new Error("Server error. Please try again later");
        }
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("Request failed:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please check your connection");
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Use frontend API for authentication
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return {
      _id: data.user.id || data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
      preferences: data.user.preferences,
    };
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> {
    // Use frontend API for registration
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token,
      preferences: data.preferences,
    };
  }

  async verifyToken(token: string): Promise<AuthResponse> {
    // Use frontend API for token verification
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.user) {
      throw new Error("Token verification failed");
    }

    return {
      _id: data.user.id || data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: token,
      preferences: data.user.preferences,
    };
  }

  async getToken(): Promise<string | null> {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem("token");
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    // You can also make an API call to invalidate the token on the server
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }
}

export const authService = new AuthService();
