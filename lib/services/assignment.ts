import { API_URL } from "@/lib/constants";
import { authService } from "@/lib/services/auth";

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  classroom: string;
  dueDate: string;
  points: number;
  submissionType: "code" | "file" | "text";
  codeTemplate?: string;
  createdAt: string;
  updatedAt: string;
  submissions?: Submission[];
  questions?: Question[];
}

export interface CreateAssignmentData {
  title: string;
  description: string;
  classroomId: string;
  dueDate: string;
  points: number;
  submissionType: "code" | "file" | "text";
  codeTemplate?: string;
}

export interface Submission {
  _id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  status: "pending" | "graded";
  submittedAt: string;
}

export interface Question {
  student: any;
  question: string;
  answers: Answer[];
  createdAt: string;
}

export interface Answer {
  user: any;
  answer: string;
  createdAt: string;
}

class AssignmentService {
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

  async createAssignment(data: CreateAssignmentData): Promise<Assignment> {
    try {
      const response = await fetch(
        `${API_URL}/api/classrooms/${data.classroomId}/assignments`,
        {
          method: "POST",
          headers: this.getAuthHeader(),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create assignment");
      }

      return response.json();
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  }

  async getAssignments(classroomId: string): Promise<Assignment[]> {
    try {
      const url = `${API_URL}/api/classrooms/${classroomId}/assignments`;
      console.log("Fetching assignments from:", url);

      const headers = this.getAuthHeader();
      console.log("Auth header:", headers);

      const response = await fetch(url, {
        headers,
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // First check if the response is ok
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        console.error("Failed to fetch assignments:", {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          url,
        });
        throw new Error(errorMessage);
      }

      // Then try to parse the response
      let data;
      try {
        const text = await response.text();
        console.log("Raw response:", text);
        data = JSON.parse(text);
        console.log("Parsed assignments response:", data);
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error(
          "Invalid response from server. Please try again later."
        );
      }

      // Validate the response format
      if (!data.success || !data.data) {
        console.error("Invalid response format:", data);
        throw new Error(
          "Invalid response format from server. Please try again later."
        );
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      if (error instanceof Error) {
        if (error.message === "Failed to fetch") {
          throw new Error(
            "Unable to connect to the server. Please check if the server is running and try again."
          );
        }
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while fetching assignments. Please try again later."
      );
    }
  }

  async getAssignment(classroomId: string, id: string): Promise<Assignment> {
    try {
      console.log("Fetching assignment:", {
        classroomId,
        assignmentId: id,
        url: `${API_URL}/api/classrooms/${classroomId}/assignments/${id}`,
      });

      const response = await fetch(
        `${API_URL}/api/classrooms/${classroomId}/assignments/${id}`,
        {
          headers: this.getAuthHeader(),
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // First check if the response is ok
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        console.error("Failed to fetch assignment:", {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
        });
        throw new Error(errorMessage);
      }

      // Then try to parse the response
      let data;
      try {
        const text = await response.text();
        console.log("Raw response:", text);
        data = JSON.parse(text);
        console.log("Parsed assignment response:", data);
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error(
          "Invalid response from server. Please try again later."
        );
      }

      // Validate the response format
      if (!data.success || !data.data) {
        console.error("Invalid response format:", data);
        throw new Error(
          "Invalid response format from server. Please try again later."
        );
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching assignment:", error);
      if (error instanceof Error) {
        if (error.message === "Failed to fetch") {
          throw new Error(
            "Unable to connect to the server. Please check if the server is running and try again."
          );
        }
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while fetching the assignment. Please try again later."
      );
    }
  }

  async updateAssignment(
    id: string,
    data: Partial<CreateAssignmentData>
  ): Promise<Assignment> {
    try {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: "PATCH",
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update assignment");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  }

  async deleteAssignment(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete assignment");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  }

  async submitAssignment(
    assignmentId: string,
    data: { content: string; file?: File },
    classroomId: string
  ): Promise<Submission> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append("content", data.content);

      if (data.file) {
        // Validate file size (20MB limit)
        if (data.file.size > 20 * 1024 * 1024) {
          throw new Error("File size exceeds 20MB limit");
        }
        formData.append("file", data.file);
      }

      // Get auth token
      const token = authService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Submitting assignment:", {
        classroomId,
        assignmentId,
        hasFile: !!data.file,
        fileSize: data.file?.size,
        contentLength: data.content.length,
      });

      // Make the request
      const response = await fetch(
        `${API_URL}/api/classrooms/${classroomId}/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Parse response
      const responseData = await response.json();
      console.log("Server response:", {
        status: response.status,
        ok: response.ok,
        data: responseData,
      });

      // Handle errors
      if (!response.ok) {
        const errorMessage =
          responseData.message ||
          responseData.error ||
          "Failed to submit assignment";
        console.error("Submission failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data: responseData,
        });
        throw new Error(errorMessage);
      }

      if (!responseData.success || !responseData.data) {
        console.error("Invalid response format:", responseData);
        throw new Error("Invalid response format from server");
      }

      // Return submission data
      return {
        _id: responseData.data._id || "",
        assignmentId,
        studentId: responseData.data.student || "",
        content: responseData.data.content || "",
        fileUrl: responseData.data.fileUrl || "",
        grade: responseData.data.grade,
        feedback: responseData.data.feedback,
        status: responseData.data.status || "submitted",
        submittedAt: responseData.data.submittedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error submitting assignment:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while submitting the assignment"
      );
    }
  }

  async gradeSubmission(
    submissionId: string,
    data: { grade: number; feedback: string }
  ): Promise<Submission> {
    try {
      const response = await fetch(
        `${API_URL}/submissions/${submissionId}/grade`,
        {
          method: "POST",
          headers: this.getAuthHeader(),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to grade submission");
      }

      return response.json();
    } catch (error) {
      console.error("Error grading submission:", error);
      throw error;
    }
  }

  async getSubmissions(assignmentId: string): Promise<Submission[]> {
    try {
      const response = await fetch(
        `${API_URL}/assignments/${assignmentId}/submissions`,
        {
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch submissions");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw error;
    }
  }

  async postQuestion(
    classroomId: string,
    assignmentId: string,
    question: string
  ): Promise<Assignment> {
    const response = await fetch(
      `${API_URL}/classrooms/${classroomId}/assignments/${assignmentId}/questions`,
      {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify({ question }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to post question");
    }
    const result = await response.json();
    return result.data;
  }

  async postAnswer(
    classroomId: string,
    assignmentId: string,
    questionIdx: number,
    answer: string
  ): Promise<Assignment> {
    const response = await fetch(
      `${API_URL}/classrooms/${classroomId}/assignments/${assignmentId}/questions/${questionIdx}/answers`,
      {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify({ answer }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to post answer");
    }
    const result = await response.json();
    return result.data;
  }
}

export const assignmentService = new AssignmentService();
