import mongoose, { Schema, Document, Query } from "mongoose";

// Define interfaces for populated fields
interface PopulatedAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
  role: string;
  semester: string;
  department: string;
  email: string;
}

interface PopulatedAnswer {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: PopulatedAuthor;
  question: mongoose.Types.ObjectId;
  createdAt: Date;
  votes: number;
  isAccepted: boolean;
}

// Define the answer schema as a separate collection
const AnswerSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
});

// Define interfaces
export interface IAnswer {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  createdAt: Date;
  votes: number;
  isAccepted: boolean;
}

export interface IQuestion extends Document {
  title: string;
  content: string;
  language?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  votes: number;
  isSolved: boolean;
}

// Define interface for populated question
export interface IPopulatedQuestion extends Omit<IQuestion, "author"> {
  author: PopulatedAuthor;
  answers: PopulatedAnswer[];
}

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    isSolved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual for answers
QuestionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "question",
  justOne: false,
});

// Add pre-find middleware to ensure proper population
QuestionSchema.pre("find", function (this: Query<any, any>) {
  this.populate("author", "name role semester department email");
});

QuestionSchema.pre("findOne", function (this: Query<any, any>) {
  this.populate("author", "name role semester department email");
});

// Add pre-find middleware for answers
QuestionSchema.pre("find", function (this: Query<any, any>) {
  this.populate({
    path: "answers",
    populate: {
      path: "author",
      select: "name role semester department email",
    },
  });
});

QuestionSchema.pre("findOne", function (this: Query<any, any>) {
  this.populate({
    path: "answers",
    populate: {
      path: "author",
      select: "name role semester department email",
    },
  });
});

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);
const Answer = mongoose.model<IAnswer>("Answer", AnswerSchema);

export { Question, Answer };
export default Question;
