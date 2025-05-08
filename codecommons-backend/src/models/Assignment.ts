import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  course: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);
