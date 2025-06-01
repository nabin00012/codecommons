import { authService } from "@/lib/services/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  points: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  instructorId: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    return { error: error.message || "An error occurred" };
  }
  const data = await response.json();
  return { data };
}

async function getHeaders() {
  const token = authService.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const apiClient = {
  // Auth endpoints
  auth: {
    login: async (credentials: {
      email: string;
      password: string;
    }): Promise<ApiResponse<{ token: string }>> => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },
    register: async (userData: {
      email: string;
      password: string;
      name: string;
    }): Promise<ApiResponse<UserProfile>> => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },

  // User endpoints
  users: {
    getProfile: async (): Promise<ApiResponse<UserProfile>> => {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    updateProfile: async (
      data: Partial<UserProfile>
    ): Promise<ApiResponse<UserProfile>> => {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },

  // Projects endpoints
  projects: {
    getAll: async (): Promise<ApiResponse<Project[]>> => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    getById: async (id: string): Promise<ApiResponse<Project>> => {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    create: async (
      data: Omit<Project, "id">
    ): Promise<ApiResponse<Project>> => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },

  // Classrooms endpoints
  classrooms: {
    getAll: async (): Promise<ApiResponse<Classroom[]>> => {
      const response = await fetch(`${API_BASE_URL}/api/classrooms`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    getById: async (id: string): Promise<ApiResponse<Classroom>> => {
      const response = await fetch(`${API_BASE_URL}/api/classrooms/${id}`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    create: async (
      data: Omit<Classroom, "id">
    ): Promise<ApiResponse<Classroom>> => {
      const response = await fetch(`${API_BASE_URL}/api/classrooms`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },

  // Challenges endpoints
  challenges: {
    getAll: async (): Promise<ApiResponse<Challenge[]>> => {
      const response = await fetch(`${API_BASE_URL}/api/challenges`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    getById: async (id: string): Promise<ApiResponse<Challenge>> => {
      const response = await fetch(`${API_BASE_URL}/api/challenges/${id}`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    submitSolution: async (
      challengeId: string,
      solution: { code: string; language: string }
    ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
      const response = await fetch(
        `${API_BASE_URL}/api/challenges/${challengeId}/submit`,
        {
          method: "POST",
          headers: await getHeaders(),
          body: JSON.stringify(solution),
        }
      );
      return handleResponse(response);
    },
  },

  // Leaderboard endpoints
  leaderboard: {
    getGlobal: async (): Promise<ApiResponse<LeaderboardEntry[]>> => {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard/global`, {
        headers: await getHeaders(),
      });
      return handleResponse(response);
    },
    getByChallenge: async (
      challengeId: string
    ): Promise<ApiResponse<LeaderboardEntry[]>> => {
      const response = await fetch(
        `${API_BASE_URL}/api/leaderboard/challenge/${challengeId}`,
        {
          headers: await getHeaders(),
        }
      );
      return handleResponse(response);
    },
  },
};
