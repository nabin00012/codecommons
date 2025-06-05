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
      const token = await authService.getToken();
      if (!token) {
        throw new Error("Authentication required to fetch discussions");
      }

      const response = await fetch(
        `${API_URL}/api/discussions?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch discussions");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch discussions: ${error.message}`);
      }
      throw new Error(
        "An unexpected error occurred while fetching discussions"
      );
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
      if (!token) {
        throw new Error("Authentication required to create discussions");
      }

      if (!data.title || !data.content) {
        throw new Error("Title and content are required");
      }

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
      if (error instanceof Error) {
        throw new Error(`Failed to create discussion: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while creating discussion");
    }
  },

  // Add a comment to a discussion
  async addComment(discussionId: string, content: string) {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error("Authentication required to add comments");
      }

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
      if (error instanceof Error) {
        throw new Error(`Failed to add comment: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while adding comment");
    }
  },

  // Toggle like on a discussion
  async toggleLike(discussionId: string) {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error("Authentication required to like discussions");
      }

      if (!discussionId) {
        throw new Error("Discussion ID is required");
      }

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
      if (error instanceof Error) {
        throw new Error(`Failed to toggle like: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while toggling like");
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
      const token = await authService.getToken();
      if (!token) {
        throw new Error("Authentication required to search discussions");
      }

      if (!query) {
        throw new Error("Search query is required");
      }

      const params = new URLSearchParams({
        query,
        page: page.toString(),
        limit: limit.toString(),
      });
      if (tags) {
        params.append("tags", tags.join(","));
      }

      const response = await fetch(
        `${API_URL}/api/discussions/search?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search discussions");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search discussions: ${error.message}`);
      }
      throw new Error(
        "An unexpected error occurred while searching discussions"
      );
    }
  },

  // Get comments for a discussion
  async getComments(discussionId: string) {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error("Authentication required to fetch comments");
      }

      const response = await fetch(
        `${API_URL}/api/discussions/${discussionId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch comments");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch comments: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while fetching comments");
    }
  },
};
