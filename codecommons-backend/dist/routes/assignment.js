"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentController_1 = require("../controllers/assignmentController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Classroom_1 = __importDefault(require("../models/Classroom"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router({ mergeParams: true });
// Configure multer for assignment submissions
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, "../../uploads/submissions");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        console.log("Checking file type:", {
            mimetype: file.mimetype,
            originalname: file.originalname,
        });
        const allowedTypes = [
            "application/pdf",
            "application/x-pdf",
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
        }
        else {
            console.error("Invalid file type:", file.mimetype);
            cb(new Error("Invalid file type. Please upload a supported file format."));
        }
    },
});
// Create a new assignment (teacher only)
router.post("/", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), assignmentController_1.createAssignment);
// Get all assignments for a classroom
router.get("/", auth_1.protect, assignmentController_1.getAssignments);
// Get assignment by ID
router.get("/:id", auth_1.protect, assignmentController_1.getAssignmentById);
// Submit assignment (student only)
router.post("/:id/submit", auth_1.protect, (0, role_1.roleMiddleware)("student"), upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const classroomId = req.params.classroomId;
        const userId = req.user.id;
        console.log("Starting assignment submission:", {
            assignmentId: id,
            classroomId,
            userId,
            hasFile: !!req.file,
            fileDetails: req.file
                ? {
                    filename: req.file.filename,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    originalname: req.file.originalname,
                }
                : null,
            content: req.body.content,
            body: req.body,
        });
        // Check if classroom exists
        const classroom = await Classroom_1.default.findById(classroomId);
        if (!classroom) {
            res.status(404).json({
                success: false,
                message: "Classroom not found",
            });
            return;
        }
        // Check if user is enrolled in the classroom
        const isEnrolled = classroom.students.includes(userId);
        if (!isEnrolled) {
            res.status(403).json({
                success: false,
                message: "You are not enrolled in this classroom",
            });
            return;
        }
        // Check if assignment exists
        const assignment = await Assignment_1.default.findById(id);
        if (!assignment) {
            res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
            return;
        }
        // Check if user has already submitted
        const existingSubmission = assignment.submissions.find((sub) => sub.student.toString() === userId);
        if (existingSubmission) {
            res.status(400).json({
                success: false,
                message: "You have already submitted this assignment",
            });
            return;
        }
        // Validate submission type
        if (assignment.submissionType === "file" && !req.file) {
            res.status(400).json({
                success: false,
                message: "File submission is required for this assignment",
            });
            return;
        }
        if (assignment.submissionType === "code" && !req.body.content) {
            res.status(400).json({
                success: false,
                message: "Code submission is required for this assignment",
            });
            return;
        }
        // Create submission object
        const submission = {
            student: new mongoose_1.default.Types.ObjectId(userId),
            content: req.body.content || "",
            submittedAt: new Date(),
            status: "submitted",
            fileUrl: "",
            fileType: "",
            fileSize: "",
        };
        // Handle file upload if present
        if (req.file) {
            try {
                submission.fileUrl = `/uploads/submissions/${req.file.filename}`;
                submission.fileType = req.file.mimetype;
                submission.fileSize = req.file.size.toString();
            }
            catch (error) {
                console.error("Error handling file upload:", error);
                res.status(500).json({
                    success: false,
                    message: "Error processing file upload",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                return;
            }
        }
        try {
            // Add submission to assignment
            assignment.submissions.push(submission);
            await assignment.save();
            console.log("Assignment submitted successfully:", {
                assignmentId: id,
                hasFile: !!req.file,
                submission,
            });
            res.status(201).json({
                success: true,
                data: submission,
            });
        }
        catch (error) {
            console.error("Error saving submission:", error);
            res.status(500).json({
                success: false,
                message: "Error saving submission",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    catch (error) {
        console.error("Error submitting assignment:", error);
        // Handle multer errors
        if (error.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                success: false,
                message: "File size exceeds 20MB limit",
            });
            return;
        }
        if (error.message === "Invalid file type") {
            res.status(400).json({
                success: false,
                message: "Invalid file type. Please upload a supported file format.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: error.message || "Failed to submit assignment",
            error: error instanceof Error ? error.message : "Unknown error",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
});
// Grade assignment (teacher only)
router.post("/:id/grade", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), assignmentController_1.gradeAssignment);
// Add Q&A endpoints
router.post("/:id/questions", auth_1.protect, (0, role_1.roleMiddleware)("student"), assignmentController_1.askQuestion);
router.post("/:id/questions/:questionIdx/answers", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), assignmentController_1.answerQuestion);
exports.default = router;
