"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerQuestion = exports.askQuestion = exports.gradeAssignment = exports.submitAssignment = exports.getAssignmentById = exports.getAssignments = exports.createAssignment = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Classroom_1 = __importDefault(require("../models/Classroom"));
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
// @desc    Create a new assignment
// @route   POST /api/classrooms/:classroomId/assignments
// @access  Private (Teacher only)
exports.createAssignment = (0, async_1.asyncHandler)(async (req, res) => {
    const { title, description, dueDate, submissionType, codeTemplate, points, } = req.body;
    const classroomId = req.params.classroomId;
    // Check if classroom exists and user is the teacher
    const classroom = await Classroom_1.default.findById(classroomId);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new errorResponse_1.ErrorResponse("Not authorized to create assignments", 403);
    }
    const assignment = await Assignment_1.default.create({
        title,
        description,
        dueDate,
        classroom: classroomId,
        submissionType,
        codeTemplate,
        points,
        submissions: [],
    });
    res.status(201).json({
        success: true,
        data: assignment,
    });
});
// @desc    Get all assignments for a classroom
// @route   GET /api/classrooms/:classroomId/assignments
// @access  Private
exports.getAssignments = (0, async_1.asyncHandler)(async (req, res) => {
    const classroomId = req.params.classroomId;
    // Check if classroom exists and user is authorized
    const classroom = await Classroom_1.default.findById(classroomId);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    const isTeacher = classroom.teacher.toString() === req.user._id.toString();
    const isStudent = classroom.students.some((student) => student._id.toString() === req.user._id.toString());
    if (!isTeacher && !isStudent) {
        throw new errorResponse_1.ErrorResponse("Not authorized to view assignments", 403);
    }
    const assignments = await Assignment_1.default.find({ classroom: classroomId })
        .populate("submissions.student", "name email")
        .sort("-createdAt");
    res.status(200).json({
        success: true,
        data: assignments,
    });
});
// @desc    Get assignment by ID
// @route   GET /api/classrooms/:classroomId/assignments/:id
// @access  Private
exports.getAssignmentById = (0, async_1.asyncHandler)(async (req, res) => {
    const { classroomId, id } = req.params;
    // Check if classroom exists and user is authorized
    const classroom = await Classroom_1.default.findById(classroomId);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    const isTeacher = classroom.teacher.toString() === req.user._id.toString();
    const isStudent = classroom.students.some((student) => student._id.toString() === req.user._id.toString());
    if (!isTeacher && !isStudent) {
        throw new errorResponse_1.ErrorResponse("Not authorized to view assignment", 403);
    }
    const assignment = await Assignment_1.default.findById(id).populate("submissions.student", "name email");
    if (!assignment) {
        throw new errorResponse_1.ErrorResponse("Assignment not found", 404);
    }
    res.status(200).json({
        success: true,
        data: assignment,
    });
});
// @desc    Submit assignment
// @route   POST /api/classrooms/:classroomId/assignments/:id/submit
// @access  Private (Student only)
const submitAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const classroomId = req.params.classroomId;
        const userId = req.user.id;
        console.log("Submitting assignment:", {
            assignmentId: id,
            classroomId,
            userId,
            hasFile: !!req.file,
            fileDetails: req.file
                ? {
                    filename: req.file.filename,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                }
                : null,
            content: req.body.content,
        });
        // Check if classroom exists
        const classroom = await Classroom_1.default.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found",
            });
        }
        // Check if user is enrolled in the classroom
        const isEnrolled = classroom.students.includes(userId);
        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this classroom",
            });
        }
        // Check if assignment exists
        const assignment = await Assignment_1.default.findById(id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }
        // Check if user has already submitted
        const existingSubmission = assignment.submissions.find((sub) => sub.student.toString() === userId);
        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted this assignment",
            });
        }
        // Create submission object
        const submission = {
            student: userId,
            content: req.body.content,
            submittedAt: new Date(),
        };
        // Handle file upload if present
        if (req.file) {
            submission.fileUrl = `/uploads/submissions/${req.file.filename}`;
            submission.fileType = req.file.mimetype;
            submission.fileSize = req.file.size;
        }
        // Add submission to assignment
        assignment.submissions.push(submission);
        await assignment.save();
        console.log("Assignment submitted successfully:", {
            assignmentId: id,
            submissionId: submission._id,
            hasFile: !!req.file,
        });
        res.status(201).json({
            success: true,
            data: submission,
        });
    }
    catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit assignment",
        });
    }
};
exports.submitAssignment = submitAssignment;
// @desc    Grade assignment
// @route   POST /api/classrooms/:classroomId/assignments/:id/grade
// @access  Private (Teacher only)
exports.gradeAssignment = (0, async_1.asyncHandler)(async (req, res) => {
    const { classroomId, id } = req.params;
    const { studentId, grade, feedback } = req.body;
    // Check if classroom exists and user is the teacher
    const classroom = await Classroom_1.default.findById(classroomId);
    if (!classroom) {
        throw new errorResponse_1.ErrorResponse("Classroom not found", 404);
    }
    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new errorResponse_1.ErrorResponse("Not authorized to grade assignments", 403);
    }
    const assignment = await Assignment_1.default.findById(id);
    if (!assignment) {
        throw new errorResponse_1.ErrorResponse("Assignment not found", 404);
    }
    // Find and update submission
    const submission = assignment.submissions.find((sub) => sub.student.toString() === studentId);
    if (!submission) {
        throw new errorResponse_1.ErrorResponse("Submission not found", 404);
    }
    submission.status = "graded";
    submission.grade = grade;
    submission.feedback = feedback;
    await assignment.save();
    res.status(200).json({
        success: true,
        data: assignment,
    });
});
// POST /api/classrooms/:classroomId/assignments/:id/questions
exports.askQuestion = (0, async_1.asyncHandler)(async (req, res) => {
    const { classroomId, id } = req.params;
    const { question } = req.body;
    if (!question || !question.trim()) {
        throw new errorResponse_1.ErrorResponse("Question is required", 400);
    }
    const assignment = await Assignment_1.default.findById(id);
    if (!assignment) {
        throw new errorResponse_1.ErrorResponse("Assignment not found", 404);
    }
    assignment.questions.push({
        student: req.user._id,
        question,
        answers: [],
        createdAt: new Date(),
    });
    await assignment.save();
    res.status(201).json({ success: true, data: assignment });
});
// POST /api/classrooms/:classroomId/assignments/:id/questions/:questionIdx/answers
exports.answerQuestion = (0, async_1.asyncHandler)(async (req, res) => {
    const { classroomId, id, questionIdx } = req.params;
    const { answer } = req.body;
    if (!answer || !answer.trim()) {
        throw new errorResponse_1.ErrorResponse("Answer is required", 400);
    }
    const assignment = await Assignment_1.default.findById(id);
    if (!assignment) {
        throw new errorResponse_1.ErrorResponse("Assignment not found", 404);
    }
    const qIdx = parseInt(questionIdx, 10);
    if (isNaN(qIdx) || !assignment.questions[qIdx]) {
        throw new errorResponse_1.ErrorResponse("Question not found", 404);
    }
    assignment.questions[qIdx].answers.push({
        user: req.user._id,
        answer,
        createdAt: new Date(),
    });
    await assignment.save();
    res.status(201).json({ success: true, data: assignment });
});
