"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/codecommons");
        console.log("MongoDB Connected");
        // Check if user already exists
        const existingUser = await User_1.default.findOne({
            email: "teacher@jainuniversity.ac.in",
        });
        if (existingUser) {
            console.log("Test user already exists");
            process.exit(0);
        }
        // Create test user
        const user = await User_1.default.create({
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
    }
    catch (error) {
        console.error("Error creating test user:", error);
        process.exit(1);
    }
};
createTestUser();
