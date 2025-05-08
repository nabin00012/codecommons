import { Request, Response, NextFunction } from "express";
import Course from "../models/Course";
// Create a new course
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, teacher } = req.body;
    const course = await Course.create({ title, description, teacher });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// Get all courses
export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// Get a single course by ID
export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "teacher",
      "name email"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// Update a course
export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// Delete a course
export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};

// Enroll a student in a course
export const enrollInCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.id;
    const userId = req.body.userId;

    // Find the course
    const course = await Course.findById(courseId);
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
  } catch (error) {
    next(error);
  }
};
