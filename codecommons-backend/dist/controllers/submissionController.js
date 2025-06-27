"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubmission = exports.updateSubmission = exports.getSubmissionById = exports.getSubmissions = exports.createSubmission = void 0;
const Submission_1 = __importDefault(require("../models/Submission"));
// Create a new submission
const createSubmission = async (req, res, next) => {
    try {
        const { assignment, student, content } = req.body;
        const submission = await Submission_1.default.create({
            assignment,
            student,
            content,
        });
        res.status(201).json(submission);
    }
    catch (error) {
        next(error);
    }
};
exports.createSubmission = createSubmission;
// Get all submissions (optionally filter by assignment or student)
const getSubmissions = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.assignment) {
            filter.assignment = req.query.assignment;
        }
        if (req.query.student) {
            filter.student = req.query.student;
        }
        const submissions = await Submission_1.default.find(filter)
            .populate("assignment")
            .populate("student", "name email");
        res.json(submissions);
    }
    catch (error) {
        next(error);
    }
};
exports.getSubmissions = getSubmissions;
// Get a single submission by ID
const getSubmissionById = async (req, res, next) => {
    try {
        const submission = await Submission_1.default.findById(req.params.id)
            .populate("assignment")
            .populate("student", "name email");
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        res.json(submission);
    }
    catch (error) {
        next(error);
    }
};
exports.getSubmissionById = getSubmissionById;
// Update a submission (grade/feedback)
const updateSubmission = async (req, res, next) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission_1.default.findByIdAndUpdate(req.params.id, { grade, feedback }, { new: true });
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        res.json(submission);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSubmission = updateSubmission;
// Delete a submission
const deleteSubmission = async (req, res, next) => {
    try {
        const submission = await Submission_1.default.findByIdAndDelete(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        res.json({ message: "Submission deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSubmission = deleteSubmission;
