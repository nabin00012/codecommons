import mongoose from "mongoose";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  department: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    department: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
