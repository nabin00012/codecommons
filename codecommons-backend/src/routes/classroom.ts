import express from "express";
import {
  createClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  enrollStudent,
  joinClassroomByCode,
  uploadMaterial,
  downloadMaterial,
} from "../controllers/classroomController";
import { protect } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";
import multer from "multer";
import path from "path";
import fs from "fs";
import assignmentRoutes from "./assignment";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/materials");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueSuffix + "-" + file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")
    );
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, Word, PowerPoint, Excel, text, and image files are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

// Create a new classroom (teacher only)
router.post("/", protect, roleMiddleware("teacher"), createClassroom);

// Get all classrooms
router.get("/", protect, getClassrooms);

// Join classroom by code (student only)
router.post("/join", protect, roleMiddleware("student"), joinClassroomByCode);

// Get classroom by ID
router.get("/:id", protect, getClassroomById);

// Update classroom (teacher only)
router.put("/:id", protect, roleMiddleware("teacher"), updateClassroom);

// Delete classroom (teacher only)
router.delete("/:id", protect, roleMiddleware("teacher"), deleteClassroom);

// Enroll student in classroom
router.post("/:id/enroll", protect, roleMiddleware("student"), enrollStudent);

// Upload material (teacher only)
router.post(
  "/:id/materials",
  protect,
  roleMiddleware("teacher"),
  upload.single("file"),
  uploadMaterial
);

// Download material
router.get("/:id/materials/:materialId/download", protect, downloadMaterial);

// Mount assignment routes
router.use("/:classroomId/assignments", assignmentRoutes);

export default router;
