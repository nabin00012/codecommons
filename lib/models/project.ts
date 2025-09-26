import mongoose from "mongoose";

// Type-only export used by client components
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  githubLink?: string;
  demoLink?: string;
  tags?: string[];
  status?: "not-started" | "in-progress" | "completed" | "overdue";
  progress?: number;
  dueDate?: Date;
}

const mediaSubSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const simpleAssetSubSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const authorSubSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    demoLink: { type: String, trim: true },
    tags: [{ type: String, trim: true }],

    media: [mediaSubSchema],
    screenshots: [simpleAssetSubSchema],
    screenRecordings: [simpleAssetSubSchema],

    author: authorSubSchema,

    isPublic: { type: Boolean, default: true },
    stars: { type: Number, default: 0 },
    contributors: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

    // Optional fields used by some client components
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "overdue"],
      default: "not-started",
    },
    progress: { type: Number, default: 0 },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema); 