import { API_URL } from "@/lib/constants";

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  classroomId: string;
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
    const token = localStorage.getItem("codecommons_token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async createAssignment(data: CreateAssignmentData): Promise<Assignment> {
    try {
      const response = await fetch(
        `${API_URL}/classrooms/${data.classroomId}/assignments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeader(),
          },
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
      const response = await fetch(
        `${API_URL}/classrooms/${classroomId}/assignments`,
        {
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch assignments");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  }

  async getAssignment(classroomId: string, id: string): Promise<Assignment> {
    try {
      const response = await fetch(
        `${API_URL}/classrooms/${classroomId}/assignments/${id}`,
        {
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch assignment");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching assignment:", error);
      throw error;
    }
  }

  async updateAssignment(
    id: string,
    data: Partial<CreateAssignmentData>
  ): Promise<Assignment> {
    try {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
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
    data: { content: string; file?: File }
  ): Promise<Submission> {
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await fetch(
        `${API_URL}/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          headers: {
            ...this.getAuthHeader(),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit assignment");
      }

      return response.json();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      throw error;
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
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeader(),
          },
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
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
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
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
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
