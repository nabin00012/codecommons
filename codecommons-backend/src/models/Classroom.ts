import mongoose, { Document, Schema } from "mongoose";

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
  students: mongoose.Types.ObjectId[];
  materials: Array<{
    id: string;
    title: string;
    type: string;
    size: string;
    uploadedOn: string;
    fileUrl: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const classroomSchema = new Schema<IClassroom>(
  {
    name: {
      type: String,
      required: [true, "Please add a classroom name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    code: {
      type: String,
      required: [true, "Please add a course code"],
      unique: true,
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Please add a semester"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructor: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: "/placeholder.svg",
      },
      department: {
        type: String,
        required: true,
      },
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
  {
    timestamps: true,
  }
);

// Generate a unique course code before saving
classroomSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  // Generate a random 6-character code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.code = code;

  next();
});

export default mongoose.model<IClassroom>("Classroom", classroomSchema);
