import mongoose from "mongoose";

export interface Submission {
  id: string;
  student: string;
  fileUrl: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  classroom: string;
  submissions: Submission[];
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: { type: String, required: true },
  submittedAt: { type: Date, required: true },
  grade: { type: Number },
  feedback: { type: String },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    points: { type: Number, required: true },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

export const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
