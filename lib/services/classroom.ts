import { API_URL } from "@/lib/constants";
import { authService } from "@/lib/services/auth";

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

export interface Material {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadedOn: string;
  fileUrl: string;
}

export class ClassroomService {
  private baseUrl: string;

  constructor(token: string) {
    this.baseUrl = `${API_URL}/api/classrooms`;
    if (token) {
      authService.setToken(token);
    }
  }

  private getAuthHeader() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getClassrooms(): Promise<Classroom[]> {
    try {
      console.log("Fetching classrooms...");
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: this.getAuthHeader(),
        credentials: "include",
      });

      console.log("Classrooms response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to fetch classrooms";
        try {
          const errorData = await response.json();
          if (response.status === 401) {
            errorMessage = "Please log in to view classrooms";
          } else if (response.status === 403) {
            errorMessage = "You are not authorized to view classrooms";
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Classrooms response:", result);

      if (!result.success || !Array.isArray(result.data)) {
        console.error("Invalid response format:", result);
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
          if (response.status === 403) {
            errorMessage =
              "You are not authorized to access this classroom. Please join the classroom first.";
          } else if (response.status === 404) {
            errorMessage = "Classroom not found";
          } else {
            errorMessage = errorData.message || errorMessage;
          }
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
      console.log("Joining classroom with code:", code);
      const response = await fetch(`${this.baseUrl}/join`, {
        method: "POST",
        headers: this.getAuthHeader(),
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      console.log("Join response status:", response.status);
      console.log(
        "Join response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      try {
        data = await response.json();
        console.log("Join response data:", data);
      } catch (e) {
        console.error("Failed to parse join response:", e);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Server error: ${response.status} ${response.statusText}`;
        console.error("Failed to join classroom:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
          errorMessage,
        });
        throw new Error(errorMessage);
      }

      if (!data.success || !data.data) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      return data.data;
    } catch (error) {
      console.error("Error joining classroom:", error);
      if (error instanceof Error) {
        if (error.message.includes("already enrolled")) {
          throw new Error("You are already enrolled in this classroom");
        } else if (error.message.includes("not found")) {
          throw new Error("Invalid classroom code. Please check and try again");
        }
        throw new Error(`Failed to join classroom: ${error.message}`);
      }
      throw new Error("Failed to join classroom: Unknown error occurred");
    }
  }

  async uploadMaterial(
    classroomId: string,
    file: File,
    title: string
  ): Promise<Material> {
    try {
      if (!file || !title) {
        throw new Error("File and title are required");
      }

      console.log("Preparing to upload:", {
        classroomId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        title,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const token = authService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.baseUrl}/${classroomId}/materials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Upload failed:", {
          status: response.status,
          statusText: response.statusText,
          error: responseData,
        });
        throw new Error(responseData.message || "Failed to upload material");
      }

      if (!responseData.success || !responseData.data) {
        throw new Error("Invalid response from server");
      }

      console.log("Upload successful:", responseData.data);
      return responseData.data;
    } catch (error) {
      console.error("Error uploading material:", error);
      throw error;
    }
  }

  async downloadMaterial(
    classroomId: string,
    materialId: string
  ): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${classroomId}/materials/${materialId}/download`,
        {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download material");
      }

      return response.blob();
    } catch (error) {
      console.error("Error downloading material:", error);
      throw error;
    }
  }
}
