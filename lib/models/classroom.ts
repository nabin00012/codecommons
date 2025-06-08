import mongoose from "mongoose";

export interface Material {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadedOn: string;
  fileUrl: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  submissions: {
    student: string;
    fileUrl: string;
    submittedAt: Date;
    grade?: number;
    feedback?: string;
  }[];
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  teacher: string;
  students: string[];
  materials: Material[];
  assignments: Assignment[];
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  uploadedOn: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

const submissionSchema = new mongoose.Schema({
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

const assignmentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  points: { type: Number, required: true },
  submissions: [submissionSchema],
});

const classroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    materials: [materialSchema],
    assignments: [assignmentSchema],
  },
  { timestamps: true }
);

export const Classroom =
  mongoose.models.Classroom || mongoose.model("Classroom", classroomSchema);
