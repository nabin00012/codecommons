import mongoose from "mongoose";

export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  language?: string;
  views: number;
  votes: number;
  answers: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    votes: number;
    isAccepted: boolean;
  }[];
  isSolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String }],
    language: { type: String },
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    answers: [
      {
        content: { type: String, required: true },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
        votes: { type: Number, default: 0 },
        isAccepted: { type: Boolean, default: false },
      },
    ],
    isSolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const QuestionModel =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
