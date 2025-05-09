import express from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  gradeAssignment,
  askQuestion,
  answerQuestion,
} from "../controllers/assignmentController";
import { protect } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";

const router = express.Router({ mergeParams: true });

// Create a new assignment (teacher only)
router.post(
  "/",
  protect as any,
  roleMiddleware("teacher") as any,
  createAssignment as any
);

// Get all assignments for a classroom
router.get("/", protect as any, getAssignments as any);

// Get assignment by ID
router.get("/:id", protect as any, getAssignmentById as any);

// Submit assignment (student only)
router.post(
  "/:id/submit",
  protect as any,
  roleMiddleware("student") as any,
  submitAssignment as any
);

// Grade assignment (teacher only)
router.post(
  "/:id/grade",
  protect as any,
  roleMiddleware("teacher") as any,
  gradeAssignment as any
);

// Add Q&A endpoints
router.post(
  "/:id/questions",
  protect as any,
  roleMiddleware("student") as any,
  askQuestion as any
);

router.post(
  "/:id/questions/:questionIdx/answers",
  protect as any,
  roleMiddleware("teacher") as any,
  answerQuestion as any
);

export default router;
