import express from "express";
import cors from "cors";
import path from "path";
import classroomRoutes from "./routes/classroom";
import authRoutes from "./routes/auth";
import assignmentRoutes from "./routes/assignment";
import submissionRoutes from "./routes/submission";
import courseRoutes from "./routes/course";

const app = express();

// Middleware
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Assignment routes (file uploads) BEFORE express.json()
app.use("/api/assignments", assignmentRoutes);

// Other routes that expect JSON
app.use(express.json());
app.use("/api/classrooms", classroomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/courses", courseRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
);

export default app;
