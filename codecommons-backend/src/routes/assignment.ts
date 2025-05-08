import express from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController";
import { protect } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";

const router = express.Router();

// Only teachers can create assignments
router.post(
  "/",
  protect as any,
  roleMiddleware("teacher") as any,
  createAssignment as any
);

// Anyone can view assignments
router.get("/", getAssignments as any);

// Get a single assignment by ID
router.get("/:id", getAssignmentById as any);

// Update an assignment
router.put("/:id", updateAssignment as any);

// Delete an assignment
router.delete("/:id", deleteAssignment as any);

export default router;
