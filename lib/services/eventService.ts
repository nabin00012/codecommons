import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  tags: string[];
  organizer: {
    name: string;
    avatar?: string;
  };
  maxAttendees: number;
  attendees: string[];
}

export const eventService = {
  // Get all events
  async getAllEvents(page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/api/events?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  },

  // Create a new event
  async createEvent(data: {
    title: string;
    description: string;
    date: Date;
    location: string;
    tags: string[];
    maxAttendees: number;
  }) {
    const response = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create event");
    }
    return response.json();
  },

  // Update an event
  async updateEvent(
    eventId: string,
    data: {
      title?: string;
      description?: string;
      date?: Date;
      location?: string;
      tags?: string[];
      maxAttendees?: number;
    }
  ) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update event");
    }
    return response.json();
  },

  // Delete an event
  async deleteEvent(eventId: string) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
    return response.json();
  },

  // Toggle attendance for an event
  async toggleAttendance(eventId: string) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}/api/events/${eventId}/attend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to toggle attendance");
    }
    return response.json();
  },

  // Search events
  async searchEvents(query: string, tags?: string[], page = 1, limit = 10) {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString(),
    });
    if (tags && tags.length > 0) {
      params.append("tags", tags.join(","));
    }

    const response = await fetch(`${API_URL}/api/events/search?${params}`);
    if (!response.ok) {
      throw new Error("Failed to search events");
    }
    return response.json();
  },

  async registerForEvent(eventId: string) {
    const response = await fetch(`${API_URL}/api/events/${eventId}/attend`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to register for event");
    }
    return response.json();
  },
};
