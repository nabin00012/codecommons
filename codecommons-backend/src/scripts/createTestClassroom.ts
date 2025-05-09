import mongoose from "mongoose";
import dotenv from "dotenv";
import Classroom from "../models/Classroom";
import User from "../models/User";

dotenv.config();

async function createTestClassroom() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/codecommons"
    );
    console.log("MongoDB Connected");

    // Find the test teacher
    const teacher = await User.findOne({
      email: "teacher@jainuniversity.ac.in",
    });
    if (!teacher) {
      console.error(
        "Test teacher not found. Please run createTestUser.ts first."
      );
      process.exit(1);
    }

    // Check if test classroom already exists
    const existingClassroom = await Classroom.findOne({
      name: "Test Classroom",
    });
    if (existingClassroom) {
      console.log("Test classroom already exists:", existingClassroom._id);
      process.exit(0);
    }

    // Create test classroom
    const classroom = await Classroom.create({
      name: "Test Classroom",
      description: "This is a test classroom for development purposes",
      code: "TEST001",
      semester: "Spring 2024",
      teacher: teacher._id,
      instructor: {
        name: teacher.name,
        avatar: "/placeholder.svg",
        department: "Computer Science",
      },
      students: [],
      materials: [],
    });

    console.log("Test classroom created successfully:", classroom._id);
    process.exit(0);
  } catch (error) {
    console.error("Error creating test classroom:", error);
    process.exit(1);
  }
}

createTestClassroom();
