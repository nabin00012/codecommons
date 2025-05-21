import { getToken } from "./auth";

interface Discussion {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussions?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch discussions");
    }
    return response.json();
  },

  // Create a new discussion
  async createDiscussion(data: {
    title: string;
    content: string;
    tags: string[];
  }) {
    const token = await getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create discussion");
    }
    return response.json();
  },

  // Add a comment to a discussion
  async addComment(discussionId: string, content: string) {
    const token = await getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussions/${discussionId}/comments`,
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
      throw new Error("Failed to add comment");
    }
    return response.json();
  },

  // Toggle like on a discussion
  async toggleLike(discussionId: string) {
    const token = await getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussions/${discussionId}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }
    return response.json();
  },

  // Search discussions
  async searchDiscussions(
    query: string,
    tags?: string[],
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussions/search?${params}`
    );
    if (!response.ok) {
      throw new Error("Failed to search discussions");
    }
    return response.json();
  },
};
