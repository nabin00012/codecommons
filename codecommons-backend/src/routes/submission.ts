import express from "express";
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
} from "../controllers/submissionController";
import { protect } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";

const router = express.Router();

// Only students can create submissions
router.post(
  "/",
  protect as any,
  roleMiddleware("student") as any,
  createSubmission as any
);

// Anyone can view submissions
router.get("/", getSubmissions as any);
router.get("/:id", getSubmissionById as any);

// Only teachers can update (grade) or delete submissions
router.put(
  "/:id",
  protect as any,
  roleMiddleware("teacher") as any,
  updateSubmission as any
);
router.delete(
  "/:id",
  protect as any,
  roleMiddleware("teacher") as any,
  deleteSubmission as any
);

export default router;
