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
    const response = await fetch(
      `${API_URL}/api/groups?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch groups");
    }
    return response.json();
  },

  // Create a new group
  async createGroup(data: {
    name: string;
    description: string;
    tags: string[];
  }) {
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
      throw new Error("Failed to create group");
    }
    return response.json();
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
      throw new Error("Failed to update group");
    }
    return response.json();
  },

  // Delete a group
  async deleteGroup(groupId: string) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete group");
    }
    return response.json();
  },

  // Join a group
  async joinGroup(groupId: string) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}/api/groups/${groupId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to join group");
    }
    return response.json();
  },

  // Leave a group
  async leaveGroup(groupId: string) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}/api/groups/${groupId}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to leave group");
    }
    return response.json();
  },

  // Search groups
  async searchGroups(
    query: string,
    tags?: string[],
    activityLevel?: "low" | "medium" | "high",
    page = 1,
    limit = 10
  ) {
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
      throw new Error("Failed to search groups");
    }
    return response.json();
  },
};
