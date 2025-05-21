import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription: string;
  githubLink: string;
  demoLink?: string;
  tags: string[];
  author: {
    _id: mongoose.Types.ObjectId;
    name: string;
    role: string;
  };
  media: Array<{
    type: "image" | "video";
    url: string;
    caption?: string;
  }>;
  screenshots: Array<{
    url: string;
    caption?: string;
  }>;
  screenRecordings: Array<{
    url: string;
    caption?: string;
  }>;
  stars: number;
  contributors: number;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

const projectSchema = new Schema<IProject>(
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
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    longDescription: {
      type: String,
      required: [true, "Please add a detailed description"],
      maxlength: [5000, "Description cannot be more than 5000 characters"],
    },
    githubLink: {
      type: String,
      required: [true, "Please add a GitHub link"],
    },
    demoLink: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          maxlength: [200, "Caption cannot be more than 200 characters"],
        },
      },
    ],
    screenshots: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          maxlength: [200, "Caption cannot be more than 200 characters"],
        },
      },
    ],
    screenRecordings: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          maxlength: [200, "Caption cannot be more than 200 characters"],
        },
      },
    ],
    stars: {
      type: Number,
      default: 0,
    },
    contributors: {
      type: Number,
      default: 1,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", projectSchema);
