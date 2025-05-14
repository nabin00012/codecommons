import mongoose, { Schema, Document } from "mongoose";

// Define the answer schema first
const AnswerSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false },
  },
  { _id: true }
); // Explicitly enable _id for subdocuments

// Define interfaces after the schema
export interface IAnswer {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  votes: number;
  isAccepted: boolean;
}

export interface IQuestion extends Document {
  title: string;
  content: string;
  language: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  views: number;
  votes: number;
  answers: mongoose.Types.DocumentArray<IAnswer>;
}

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  answers: [AnswerSchema],
});

// Add methods to the schema
QuestionSchema.methods.findAnswer = function (answerId: string) {
  return this.answers.id(answerId);
};

export default mongoose.model<IQuestion>("Question", QuestionSchema);
