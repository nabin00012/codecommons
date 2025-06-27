"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMaterial = exports.uploadMaterial = exports.joinClassroomByCode = exports.enrollStudent = exports.deleteClassroom = exports.updateClassroom = exports.getClassroomById = exports.getClassrooms = exports.createClassroom = void 0;
const Classroom_1 = __importDefault(require("../models/Classroom"));
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// @desc    Create a new classroom
// @route   POST /api/classrooms
// @access  Private (Teacher only)
exports.createClassroom = (0, async_1.asyncHandler)(async (req, res) => {
    const { name, description, semester } = req.body;
    // Get teacher information
    const teacher = await User_1.default.findById(req.user._id);
    if (!teacher) {
        throw new errorResponse_1.ErrorResponse("Teacher not found", 404);
    }
    // Generate a unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const classroom = await Classroom_1.default.create({
        name,
        description,
        semester,
        code,
        teacher: req.user._id,
        instructor: {
            name: teacher.name,
            avatar: "/placeholder.svg",
            department: "Computer Science",
        },
        students: [],
    });
    res.status(201).json({
        success: true,
        data: classroom,
    });
});
// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private
exports.getClassrooms = (0, async_1.asyncHandler)(async (req, res) => {
    console.log("Getting classrooms for user:", req.user._id, "with role:", req.user.role);
    let query;
    if (req.user.role === "teacher") {
        // For teachers, show all their classrooms
        query = { teacher: req.user._id };
    }
    else {
        // For students, show classrooms they are enrolled in
        query = { students: req.user._id };
    }
    console.log("Query:", query);
    const classrooms = await Classroom_1.default.find(query)
        .populate("teacher", "name email")
        .populate("students", "name email")
        .sort("-createdAt");
    console.log("Found classrooms:", classrooms.length);
    res.status(200).json({
        success: true,
        data: classrooms,
    });
});
// @desc    Get classroom by ID
// @route   GET /api/classrooms/:id
// @access  Private
exports.getClassroomById = (0, async_1.asyncHandler)(async (req, res) => {
    const classroom = await Classroom_1.default.findById(req.params.id)
        .populate("teacher", "name email")
        .populate("students", "name email");
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    // Check if user is teacher or student
    const isTeacher = classroom.teacher._id.toString() === req.user._id.toString();
    const isStudent = classroom.students.some((student) => student._id.toString() === req.user._id.toString());
    if (!isTeacher && !isStudent) {
        throw new errorResponse_1.ErrorResponse("Not authorized to access this classroom", 403);
    }
    res.status(200).json({
        success: true,
        data: classroom,
    });
});
// @desc    Update classroom
// @route   PATCH /api/classrooms/:id
// @access  Private (Teacher only)
exports.updateClassroom = (0, async_1.asyncHandler)(async (req, res) => {
    let classroom = await Classroom_1.default.findById(req.params.id);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    // Check if user is teacher
    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new errorResponse_1.ErrorResponse("Not authorized to update this classroom", 403);
    }
    classroom = await Classroom_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: classroom,
    });
});
// @desc    Delete classroom
// @route   DELETE /api/classrooms/:id
// @access  Private (Teacher only)
exports.deleteClassroom = (0, async_1.asyncHandler)(async (req, res) => {
    const classroom = await Classroom_1.default.findById(req.params.id);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    // Check if user is teacher
    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new errorResponse_1.ErrorResponse("Not authorized to delete this classroom", 403);
    }
    await classroom.deleteOne();
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Enroll student in classroom
// @route   POST /api/classrooms/:id/enroll
// @access  Private (Student only)
exports.enrollStudent = (0, async_1.asyncHandler)(async (req, res) => {
    const classroom = await Classroom_1.default.findById(req.params.id);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
        throw new errorResponse_1.ErrorResponse("Student is already enrolled", 400);
    }
    classroom.students.push(req.user._id);
    await classroom.save();
    res.status(200).json({
        success: true,
        data: classroom,
    });
});
// @desc    Join classroom by code
// @route   POST /api/classrooms/join
// @access  Private (Student only)
exports.joinClassroomByCode = (0, async_1.asyncHandler)(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        throw new errorResponse_1.ErrorResponse("Classroom code is required", 400);
    }
    const classroom = await Classroom_1.default.findOne({ code });
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Invalid classroom code", 404);
    }
    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
        throw new errorResponse_1.ErrorResponse("You are already enrolled in this classroom", 400);
    }
    // Add student to classroom
    classroom.students.push(req.user._id);
    await classroom.save();
    // Populate teacher and students information
    await classroom.populate("teacher", "name email");
    await classroom.populate("students", "name email");
    res.status(200).json({
        success: true,
        data: classroom,
    });
});
const uploadMaterial = async (req, res) => {
    try {
        console.log("Upload request received:", {
            params: req.params,
            body: req.body,
            file: req.file,
            user: req.user,
        });
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
            return;
        }
        const title = req.body.title;
        if (!title) {
            res.status(400).json({
                success: false,
                message: "Title is required",
            });
            return;
        }
        console.log("File details:", {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });
        const classroom = await Classroom_1.default.findById(req.params.id);
        if (!classroom) {
            res.status(404).json({
                success: false,
                message: "Classroom not found",
            });
            return;
        }
        // Check if user is the teacher of this classroom
        if (classroom.teacher.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: "Only the teacher can upload materials",
            });
            return;
        }
        const material = {
            id: new mongoose_1.default.Types.ObjectId().toString(),
            title,
            type: req.file.mimetype,
            size: `${(req.file.size / 1024).toFixed(2)} KB`,
            uploadedOn: new Date().toISOString(),
            fileUrl: `/uploads/materials/${req.file.filename}`,
        };
        classroom.materials.push(material);
        await classroom.save();
        res.status(201).json({
            success: true,
            data: material,
        });
    }
    catch (error) {
        console.error("Error uploading material:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading material",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.uploadMaterial = uploadMaterial;
const downloadMaterial = async (req, res) => {
    try {
        const { id, materialId } = req.params;
        const classroom = await Classroom_1.default.findById(id);
        if (!classroom) {
            res.status(404).json({
                success: false,
                message: "Classroom not found",
            });
            return;
        }
        const material = classroom.materials.find((m) => m.id === materialId);
        if (!material) {
            res.status(404).json({
                success: false,
                message: "Material not found",
            });
            return;
        }
        const filePath = path_1.default.join(process.cwd(), material.fileUrl);
        res.download(filePath);
    }
    catch (error) {
        console.error("Error downloading material:", error);
        res.status(500).json({
            success: false,
            message: "Failed to download material",
        });
    }
};
exports.downloadMaterial = downloadMaterial;
