import { Request, Response, NextFunction } from "express";
import Assignment from "../models/Assignment";

// Create a new assignment
export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, dueDate, course, createdBy } = req.body;
    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      course,
      createdBy,
    });
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

// Get all assignments (optionally filter by course)
export const getAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: any = {};
    if (req.query.course) {
      filter.course = req.query.course;
    }
    const assignments = await Assignment.find(filter).populate("course");
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

// Get a single assignment by ID
export const getAssignmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "course"
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

// Update an assignment
export const updateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, dueDate } = req.body;
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate },
      { new: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

// Delete an assignment
export const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    next(error);
  }
};
