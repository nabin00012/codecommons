"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollInCourse = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getCourses = exports.createCourse = void 0;
const Course_1 = __importDefault(require("../models/Course"));
// Create a new course
const createCourse = async (req, res, next) => {
    try {
        const { title, description, teacher } = req.body;
        const course = await Course_1.default.create({ title, description, teacher });
        res.status(201).json(course);
    }
    catch (error) {
        next(error);
    }
};
exports.createCourse = createCourse;
// Get all courses
const getCourses = async (req, res, next) => {
    try {
        const courses = await Course_1.default.find().populate("teacher", "name email");
        res.json(courses);
    }
    catch (error) {
        next(error);
    }
};
exports.getCourses = getCourses;
// Get a single course by ID
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course_1.default.findById(req.params.id).populate("teacher", "name email");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseById = getCourseById;
// Update a course
const updateCourse = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const course = await Course_1.default.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCourse = updateCourse;
// Delete a course
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course_1.default.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCourse = deleteCourse;
// Enroll a student in a course
const enrollInCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userId = req.body.userId;
        // Find the course
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // Check if already enrolled
        if (course.students.includes(userId)) {
            return res
                .status(400)
                .json({ message: "Already enrolled in this course" });
        }
        // Add student to course
        course.students.push(userId);
        await course.save();
        res.json({ message: "Enrolled successfully", course });
    }
    catch (error) {
        next(error);
    }
};
exports.enrollInCourse = enrollInCourse;
