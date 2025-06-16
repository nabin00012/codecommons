import mongoose from "mongoose";

export interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  questionId: string;
  votes: number;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  upvotes: string[];
  downvotes: string[];
}

const answerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    votes: { type: Number, default: 0 },
    accepted: { type: Boolean, default: false },
    upvotes: [{ type: String, default: [] }],
    downvotes: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

export const Answer =
  mongoose.models.Answer || mongoose.model("Answer", answerSchema);
