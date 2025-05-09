import { API_URL } from "@/lib/constants";

export interface Classroom {
  _id: string;
  name: string;
  description: string;
  code: string;
  semester: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
  };
  instructor: {
    name: string;
    avatar: string;
    department: string;
  };
  students: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    type: string;
    size: string;
    uploadedOn: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassroomData {
  name: string;
  description: string;
  semester: string;
}

export class ClassroomService {
  private baseUrl: string;
  private token: string;

  constructor(token: string) {
    this.baseUrl = `${API_URL}/classrooms`;
    this.token = token;
  }

  private getAuthHeader() {
    if (!this.token) {
      throw new Error("No authentication token found");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  async getClassrooms(): Promise<Classroom[]> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: this.getAuthHeader(),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch classrooms";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw error;
    }
  }

  async createClassroom(data: CreateClassroomData): Promise<Classroom> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      console.log("Creating classroom:", data);
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.getAuthHeader(),
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create classroom";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Created classroom:", result);

      if (!result.success || !result.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error creating classroom:", error);
      throw error;
    }
  }

  async getClassroom(id: string): Promise<Classroom> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      console.log("Fetching classroom:", id);
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: this.getAuthHeader(),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch classroom";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Classroom data:", result);

      if (!result.success || !result.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching classroom:", error);
      throw error;
    }
  }

  async updateClassroom(
    id: string,
    data: Partial<CreateClassroomData>
  ): Promise<Classroom> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating classroom:", id, data);
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: this.getAuthHeader(),
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update classroom";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Updated classroom:", result);

      if (!result.success || !result.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error updating classroom:", error);
      throw error;
    }
  }

  async deleteClassroom(id: string): Promise<void> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      console.log("Deleting classroom:", id);
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete classroom";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting classroom:", error);
      throw error;
    }
  }

  async enrollStudent(id: string): Promise<Classroom> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      console.log("Enrolling student in classroom:", id);
      const response = await fetch(`${this.baseUrl}/${id}/enroll`, {
        method: "POST",
        headers: this.getAuthHeader(),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to enroll in classroom";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Enrollment result:", result);

      if (!result.success || !result.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error enrolling in classroom:", error);
      throw error;
    }
  }

  async joinClassroomByCode(code: string): Promise<Classroom> {
    try {
      if (!this.token) {
        throw new Error("No authentication token found");
      }

      console.log("Joining classroom with code:", code);
      const response = await fetch(`${this.baseUrl}/join`, {
        method: "POST",
        headers: this.getAuthHeader(),
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to join classroom";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Join result:", result);

      if (!result.success || !result.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error joining classroom:", error);
      throw error;
    }
  }
}
