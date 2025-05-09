import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/codecommons"
    );
    console.log("MongoDB Connected");

    // Check if user already exists
    const existingUser = await User.findOne({
      email: "teacher@jainuniversity.ac.in",
    });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
    }

    // Create test user
    const user = await User.create({
      name: "Test Teacher",
      email: "teacher@jainuniversity.ac.in",
      password: "Password123", // This will be hashed automatically
      role: "teacher",
    });

    console.log("Test user created successfully:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
};

createTestUser();
