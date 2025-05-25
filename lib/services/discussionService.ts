import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    department: string;
    avatar?: string;
  };
  tags: string[];
  likes: string[];
  comments: {
    content: string;
    author: {
      name: string;
      department: string;
      avatar?: string;
    };
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const discussionService = {
  // Get all discussions
  async getAllDiscussions(page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/api/discussions?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch discussions");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching discussions:", error);
      throw error;
    }
  },

  // Create a new discussion
  async createDiscussion(data: {
    title: string;
    content: string;
    tags: string[];
  }) {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_URL}/api/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create discussion");
      }
      return response.json();
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  },

  // Add a comment to a discussion
  async addComment(discussionId: string, content: string) {
    try {
      const token = await authService.getToken();
      const response = await fetch(
        `${API_URL}/api/discussions/${discussionId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add comment");
      }
      return response.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Toggle like on a discussion
  async toggleLike(discussionId: string) {
    try {
      const token = await authService.getToken();
      const response = await fetch(
        `${API_URL}/api/discussions/${discussionId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to toggle like");
      }
      return response.json();
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },

  // Search discussions
  async searchDiscussions(
    query: string,
    tags?: string[],
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

      const response = await fetch(
        `${API_URL}/api/discussions/search?${params}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search discussions");
      }
      return response.json();
    } catch (error) {
      console.error("Error searching discussions:", error);
      throw error;
    }
  },

  // Get comments for a discussion
  async getComments(discussionId: string) {
    try {
      const response = await fetch(
        `${API_URL}/api/discussions/${discussionId}/comments`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch comments");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
};
