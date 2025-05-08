import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  teacher: Types.ObjectId;
  students: Types.ObjectId[];
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICourse>("Course", courseSchema);
