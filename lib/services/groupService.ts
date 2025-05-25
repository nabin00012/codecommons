import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activityLevel: "High" | "Medium" | "Low";
  tags: string[];
  isJoined?: boolean;
  creator: {
    name: string;
    avatar?: string;
  };
}

export const groupService = {
  // Get all groups
  async getAllGroups(page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/api/groups?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch groups");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  },

  // Create a new group
  async createGroup(data: {
    name: string;
    description: string;
    tags: string[];
  }) {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create group");
      }
      return response.json();
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  },

  // Update a group
  async updateGroup(
    groupId: string,
    data: {
      name?: string;
      description?: string;
      tags?: string[];
    }
  ) {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update group");
      }
      return response.json();
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  },

  // Delete a group
  async deleteGroup(groupId: string) {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete group");
      }
      return response.json();
    } catch (error) {
      console.error("Error deleting group:", error);
      throw error;
    }
  },

  // Join a group
  async joinGroup(groupId: string) {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_URL}/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join group");
      }
      return response.json();
    } catch (error) {
      console.error("Error joining group:", error);
      throw error;
    }
  },

  // Leave a group
  async leaveGroup(groupId: string) {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_URL}/api/groups/${groupId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to leave group");
      }
      return response.json();
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  },

  // Search groups
  async searchGroups(
    query: string,
    tags?: string[],
    activityLevel?: "low" | "medium" | "high",
    page = 1,
    limit = 10
  ) {
    try {
      const params = new URLSearchParams({
        query,
        page: page.toString(),
        limit: limit.toString(),
      });
      if (tags) {
        params.append("tags", tags.join(","));
      }
      if (activityLevel) {
        params.append("activityLevel", activityLevel);
      }

      const response = await fetch(`${API_URL}/api/groups/search?${params}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search groups");
      }
      return response.json();
    } catch (error) {
      console.error("Error searching groups:", error);
      throw error;
    }
  },
};
