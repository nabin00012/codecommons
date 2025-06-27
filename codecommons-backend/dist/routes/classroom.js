"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classroomController_1 = require("../controllers/classroomController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const assignment_1 = __importDefault(require("./assignment"));
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, "../../uploads/materials");
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
const fileFilter = (req, file, cb) => {
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
    }
    else {
        cb(new Error("Invalid file type. Only PDF, Word, PowerPoint, Excel, text, and image files are allowed."));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
    },
});
// Create a new classroom (teacher only)
router.post("/", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), classroomController_1.createClassroom);
// Get all classrooms
router.get("/", auth_1.protect, classroomController_1.getClassrooms);
// Join classroom by code (student only)
router.post("/join", auth_1.protect, (0, role_1.roleMiddleware)("student"), classroomController_1.joinClassroomByCode);
// Get classroom by ID
router.get("/:id", auth_1.protect, classroomController_1.getClassroomById);
// Update classroom (teacher only)
router.put("/:id", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), classroomController_1.updateClassroom);
// Delete classroom (teacher only)
router.delete("/:id", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), classroomController_1.deleteClassroom);
// Enroll student in classroom
router.post("/:id/enroll", auth_1.protect, (0, role_1.roleMiddleware)("student"), classroomController_1.enrollStudent);
// Upload material (teacher only)
router.post("/:id/materials", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), upload.single("file"), classroomController_1.uploadMaterial);
// Download material
router.get("/:id/materials/:materialId/download", auth_1.protect, classroomController_1.downloadMaterial);
// Mount assignment routes
router.use("/:classroomId/assignments", assignment_1.default);
exports.default = router;
