import mongoose, { Document, Schema } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  classroom: mongoose.Types.ObjectId;
  submissionType: "code" | "file" | "text" | "mixed";
  codeTemplate?: string;
  instructions?: string;
  maxPoints: number;
  attachments: mongoose.Types.ObjectId[]; // References to File documents
  materials: mongoose.Types.ObjectId[]; // References to File documents (read-only materials)
  isPublished: boolean;
  allowLateSubmissions: boolean;
  lateSubmissionDeadline?: Date;
  rubric?: {
    criteria: Array<{
      name: string;
      description: string;
      points: number;
    }>;
    totalPoints: number;
  };
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // in minutes
  submissions: Array<{
    student: mongoose.Types.ObjectId;
    submittedAt: Date;
    status: "draft" | "submitted" | "graded" | "returned";
    grade?: number;
    feedback?: string;
    content?: string;
    fileUrl?: string;
    fileType?: string;
    fileSize?: string;
    attempts: number;
    lastModifiedAt: Date;
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
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please add a due date"],
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    submissionType: {
      type: String,
      enum: ["code", "file", "text", "mixed"],
      required: [true, "Please specify submission type"],
      default: "mixed",
    },
    codeTemplate: {
      type: String,
      default: "",
    },
    instructions: {
      type: String,
      maxlength: [5000, "Instructions cannot be more than 5000 characters"],
    },
    maxPoints: {
      type: Number,
      required: [true, "Max points is required"],
      min: [1, "Max points must be at least 1"],
      max: [1000, "Max points cannot exceed 1000"],
      default: 100,
    },
    attachments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    }],
    materials: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    allowLateSubmissions: {
      type: Boolean,
      default: false,
    },
    lateSubmissionDeadline: {
      type: Date,
    },
    rubric: {
      criteria: [{
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        points: {
          type: Number,
          required: true,
          min: 0,
        },
      }],
      totalPoints: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    estimatedDuration: {
      type: Number,
      min: [5, "Estimated duration must be at least 5 minutes"],
      max: [1440, "Estimated duration cannot exceed 24 hours (1440 minutes)"],
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
          enum: ["draft", "submitted", "graded", "returned"],
          default: "draft",
        },
        grade: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: {
          type: String,
          maxlength: [5000, "Feedback cannot be more than 5000 characters"],
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
        attempts: {
          type: Number,
          default: 1,
          min: 1,
        },
        lastModifiedAt: {
          type: Date,
          default: Date.now,
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
