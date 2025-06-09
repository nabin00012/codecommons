import mongoose from "mongoose";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classroom: string;
  dueDate: Date;
  submissions: {
    student: string;
    content: string;
    submittedAt: Date;
    grade?: number;
    feedback?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    dueDate: { type: Date, required: true },
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
        grade: { type: Number },
        feedback: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
