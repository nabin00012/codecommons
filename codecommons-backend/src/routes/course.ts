import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
} from "../controllers/courseController";
import { protect } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";

const router = express.Router();

// Create a new course (teacher only)
router.post(
  "/",
  protect as any,
  roleMiddleware("teacher") as any,
  createCourse as any
);

// Get all courses
router.get("/", getCourses as any);

// Get a single course by ID
router.get("/:id", getCourseById as any);

// Update a course (teacher only)
router.put(
  "/:id",
  protect as any,
  roleMiddleware("teacher") as any,
  updateCourse as any
);

// Delete a course (teacher only)
router.delete(
  "/:id",
  protect as any,
  roleMiddleware("teacher") as any,
  deleteCourse as any
);

// Enroll a student in a course (student only)
router.post(
  "/:id/enroll",
  protect as any,
  roleMiddleware("student") as any,
  enrollInCourse as any
);

export default router;
