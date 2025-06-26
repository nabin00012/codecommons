import mongoose from "mongoose";

export interface Group {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Group =
  mongoose.models.Group || mongoose.model("Group", groupSchema);
