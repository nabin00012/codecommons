export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  status: "pending" | "graded" | "returned";
  grade?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
}
