import express from "express";
import {
  createClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  enrollStudent,
  joinClassroomByCode,
} from "../controllers/classroomController";
import { protect } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";
import assignmentRoutes from "./assignment";

const router = express.Router();

// Create a new classroom (teacher only)
router.post(
  "/",
  protect as any,
  roleMiddleware("teacher") as any,
  createClassroom as any
);

// Get all classrooms
router.get("/", protect as any, getClassrooms as any);

// Join classroom by code (student only)
router.post(
  "/join",
  protect as any,
  roleMiddleware("student") as any,
  joinClassroomByCode as any
);

// Get classroom by ID
router.get("/:id", protect as any, getClassroomById as any);

// Update classroom (teacher only)
router.patch(
  "/:id",
  protect as any,
  roleMiddleware("teacher") as any,
  updateClassroom as any
);

// Delete classroom (teacher only)
router.delete(
  "/:id",
  protect as any,
  roleMiddleware("teacher") as any,
  deleteClassroom as any
);

// Enroll student in classroom
router.post(
  "/:id/enroll",
  protect as any,
  roleMiddleware("student") as any,
  enrollStudent as any
);

// Mount assignment routes
router.use("/:classroomId/assignments", assignmentRoutes);

export default router;
