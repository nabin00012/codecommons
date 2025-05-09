import { Request, Response } from "express";
import Classroom from "../models/Classroom";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";
import User from "../models/User";

// @desc    Create a new classroom
// @route   POST /api/classrooms
// @access  Private (Teacher only)
export const createClassroom = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, semester } = req.body;

    // Get teacher information
    const teacher = await User.findById(req.user._id);
    if (!teacher) {
      throw new ErrorResponse("Teacher not found", 404);
    }

    // Generate a unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const classroom = await Classroom.create({
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
  }
);

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private
export const getClassrooms = asyncHandler(
  async (req: Request, res: Response) => {
    const classrooms = await Classroom.find({
      $or: [{ teacher: req.user._id }, { students: req.user._id }],
    })
      .populate("teacher", "name email")
      .populate("students", "name email");

    res.status(200).json({
      success: true,
      data: classrooms,
    });
  }
);

// @desc    Get classroom by ID
// @route   GET /api/classrooms/:id
// @access  Private
export const getClassroomById = asyncHandler(
  async (req: Request, res: Response) => {
    const classroom = await Classroom.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!classroom) {
      throw new ErrorResponse("Classroom not found", 404);
    }

    // Check if user is teacher or student
    const isTeacher =
      classroom.teacher._id.toString() === req.user._id.toString();
    const isStudent = classroom.students.some(
      (student: any) => student._id.toString() === req.user._id.toString()
    );

    if (!isTeacher && !isStudent) {
      throw new ErrorResponse("Not authorized to access this classroom", 403);
    }

    res.status(200).json({
      success: true,
      data: classroom,
    });
  }
);

// @desc    Update classroom
// @route   PATCH /api/classrooms/:id
// @access  Private (Teacher only)
export const updateClassroom = asyncHandler(
  async (req: Request, res: Response) => {
    let classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      throw new ErrorResponse("Classroom not found", 404);
    }

    // Check if user is teacher
    if (classroom.teacher.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("Not authorized to update this classroom", 403);
    }

    classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: classroom,
    });
  }
);

// @desc    Delete classroom
// @route   DELETE /api/classrooms/:id
// @access  Private (Teacher only)
export const deleteClassroom = asyncHandler(
  async (req: Request, res: Response) => {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      throw new ErrorResponse("Classroom not found", 404);
    }

    // Check if user is teacher
    if (classroom.teacher.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("Not authorized to delete this classroom", 403);
    }

    await classroom.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Enroll student in classroom
// @route   POST /api/classrooms/:id/enroll
// @access  Private (Student only)
export const enrollStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      throw new ErrorResponse("Classroom not found", 404);
    }

    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
      throw new ErrorResponse("Student is already enrolled", 400);
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    res.status(200).json({
      success: true,
      data: classroom,
    });
  }
);

// @desc    Join classroom by code
// @route   POST /api/classrooms/join
// @access  Private (Student only)
export const joinClassroomByCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
      throw new ErrorResponse("Classroom code is required", 400);
    }

    const classroom = await Classroom.findOne({ code });

    if (!classroom) {
      throw new ErrorResponse("Invalid classroom code", 404);
    }

    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
      throw new ErrorResponse(
        "You are already enrolled in this classroom",
        400
      );
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
  }
);
