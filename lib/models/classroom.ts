import mongoose, { Schema, Document } from "mongoose";

export interface IMaterial {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadedOn: string;
  fileUrl: string;
}

export interface IClassroom extends Document {
  name: string;
  description: string;
  code: string;
  semester: string;
  teacher: mongoose.Types.ObjectId;
  instructor: {
    name: string;
    avatar: string;
    department: string;
  };
  students: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  }>;
  materials: IMaterial[];
  createdAt: Date;
  updatedAt: Date;
}

const classroomSchema = new Schema<IClassroom>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    semester: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    instructor: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      department: { type: String, required: true },
    },
    students: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    materials: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: String, required: true },
        uploadedOn: { type: String, required: true },
        fileUrl: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Classroom =
  mongoose.models.Classroom ||
  mongoose.model<IClassroom>("Classroom", classroomSchema);
