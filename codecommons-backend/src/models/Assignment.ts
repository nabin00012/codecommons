import mongoose, { Document, Schema } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  classroom: mongoose.Types.ObjectId;
  submissionType: "code" | "file" | "text";
  codeTemplate?: string;
  submissions: Array<{
    student: mongoose.Types.ObjectId;
    submittedAt: Date;
    status: "submitted" | "graded";
    grade?: number;
    feedback?: string;
    content: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: string;
  }>;
  questions: Array<{
    student: mongoose.Types.ObjectId;
    question: string;
    answers: Array<{
      user: mongoose.Types.ObjectId;
      answer: string;
      createdAt: Date;
    }>;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please add a due date"],
    },
    submissionType: {
      type: String,
      enum: ["code", "file", "text"],
      required: [true, "Please specify submission type"],
      default: "file",
    },
    codeTemplate: {
      type: String,
      default: "",
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["submitted", "graded"],
          default: "submitted",
        },
        grade: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: {
          type: String,
          maxlength: [500, "Feedback cannot be more than 500 characters"],
        },
        content: {
          type: String,
          default: "",
        },
        fileUrl: {
          type: String,
          default: "",
        },
        fileType: {
          type: String,
          default: "",
        },
        fileSize: {
          type: String,
          default: "",
        },
      },
    ],
    questions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        answers: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            answer: {
              type: String,
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);
