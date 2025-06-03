import express from "express";
import path from "path";
import classroomRoutes from "./routes/classroom";
import authRoutes from "./routes/auth";
import assignmentRoutes from "./routes/assignment";
import submissionRoutes from "./routes/submission";
import courseRoutes from "./routes/course";
import discussionRoutes from "./routes/discussionRoutes";
import eventRoutes from "./routes/eventRoutes";
import groupRoutes from "./routes/groupRoutes";

const app = express();

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

// Community routes
app.use("/api/discussions", discussionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/groups", groupRoutes);

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
