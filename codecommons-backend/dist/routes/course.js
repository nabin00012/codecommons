"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
// Create a new course (teacher only)
router.post("/", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), courseController_1.createCourse);
// Get all courses
router.get("/", courseController_1.getCourses);
// Get a single course by ID
router.get("/:id", courseController_1.getCourseById);
// Update a course (teacher only)
router.put("/:id", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), courseController_1.updateCourse);
// Delete a course (teacher only)
router.delete("/:id", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), courseController_1.deleteCourse);
// Enroll a student in a course (student only)
router.post("/:id/enroll", auth_1.protect, (0, role_1.roleMiddleware)("student"), courseController_1.enrollInCourse);
exports.default = router;
