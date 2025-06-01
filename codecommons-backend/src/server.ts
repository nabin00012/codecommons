import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import assignmentRoutes from "./routes/assignment";
import submissionRoutes from "./routes/submission";
import classroomRoutes from "./routes/classroom";
import codecornerRoutes from "./routes/codecorner";
import discussionRoutes from "./routes/discussionRoutes";
import eventRoutes from "./routes/eventRoutes";
import groupRoutes from "./routes/groupRoutes";
import projectRoutes from "./routes/projects";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);
  next();
});

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CodeCommons API" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classrooms/:classroomId/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/codecorner", codecornerRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/projects", projectRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
