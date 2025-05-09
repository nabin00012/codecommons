import { UserRole } from "@/lib/context/user-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
const TOKEN_KEY = "token";

interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const url = `${API_URL}/api/auth/login`;
    console.log("Making login request to:", url);
    console.log("Request body:", JSON.stringify(credentials, null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      // Log the raw response first
      console.log("Raw response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      let data;
      try {
        data = await response.json();
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("Login failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(
          data?.message ||
            `Server error: ${response.status} ${response.statusText}`
        );
      }

      // Validate the response data
      if (!data._id || !data.name || !data.email || !data.role || !data.token) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      // Store token in localStorage
      this.setToken(data.token);
      console.log("Token stored successfully");

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", {
          message: error.message,
          stack: error.stack,
        });
      } else {
        console.error("Unknown error:", error);
      }
      throw error;
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<LoginResponse> {
    const url = `${API_URL}/api/auth/register`;
    console.log("Making registration request to:", url);
    console.log("Request body:", JSON.stringify(userData, null, 2));

    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Log the raw response first
      console.log("Raw response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      let data;
      try {
        data = await response.json();
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Server error: ${response.status} ${response.statusText}`;
        console.error("Registration failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
          errorMessage,
        });
        throw new Error(errorMessage);
      }

      // Validate the response data
      if (!data._id || !data.name || !data.email || !data.role || !data.token) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      // Store token in localStorage
      this.setToken(data.token);
      console.log("Token stored successfully after registration");

      return data;
    } catch (error) {
      console.error("Registration error details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Registration request timed out. Please try again.");
        } else if (error.message === "Failed to fetch") {
          throw new Error(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        }
        throw new Error(`Registration failed: ${error.message}`);
      } else {
        throw new Error("Registration failed: Unknown error occurred");
      }
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    console.log("Token removed on logout");
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log("Retrieved token:", token ? "Token exists" : "No token found");
    return token;
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Token set successfully");
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    console.log(
      "Authentication status:",
      isAuth ? "Authenticated" : "Not authenticated"
    );
    return isAuth;
  },
};
