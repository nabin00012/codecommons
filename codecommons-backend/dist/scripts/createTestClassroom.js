"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Classroom_1 = __importDefault(require("../models/Classroom"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
async function createTestClassroom() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/codecommons");
        console.log("MongoDB Connected");
        // Find the test teacher
        const teacher = await User_1.default.findOne({
            email: "teacher@jainuniversity.ac.in",
        });
        if (!teacher) {
            console.error("Test teacher not found. Please run createTestUser.ts first.");
            process.exit(1);
        }
        // Check if test classroom already exists
        const existingClassroom = await Classroom_1.default.findOne({
            name: "Test Classroom",
        });
        if (existingClassroom) {
            console.log("Test classroom already exists:", existingClassroom._id);
            process.exit(0);
        }
        // Create test classroom
        const classroom = await Classroom_1.default.create({
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
    }
    catch (error) {
        console.error("Error creating test classroom:", error);
        process.exit(1);
    }
}
createTestClassroom();
