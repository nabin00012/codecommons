import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  content: string;
  grade?: string;
  feedback?: string;
  submittedAt: Date;
  fileUrl?: string;
  fileType?: string;
  fileSize?: string;
}

const submissionSchema = new Schema<ISubmission>({
  assignment: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  grade: {
    type: String,
  },
  feedback: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: false,
  },
  fileType: {
    type: String,
    required: false,
  },
  fileSize: {
    type: String,
    required: false,
  },
});

export default mongoose.model<ISubmission>("Submission", submissionSchema);
