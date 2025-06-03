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
  token: string;
  user: User;
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authService = new AuthService();
