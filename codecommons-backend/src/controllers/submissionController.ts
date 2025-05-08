import { Request, Response, NextFunction } from "express";
import Submission from "../models/Submission";

// Create a new submission
export const createSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignment, student, content } = req.body;
    const submission = await Submission.create({
      assignment,
      student,
      content,
    });
    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// Get all submissions (optionally filter by assignment or student)
export const getSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: any = {};
    if (req.query.assignment) {
      filter.assignment = req.query.assignment;
    }
    if (req.query.student) {
      filter.student = req.query.student;
    }
    const submissions = await Submission.find(filter)
      .populate("assignment")
      .populate("student", "name email");
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

// Get a single submission by ID
export const getSubmissionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("assignment")
      .populate("student", "name email");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// Update a submission (grade/feedback)
export const updateSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// Delete a submission
export const deleteSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json({ message: "Submission deleted" });
  } catch (error) {
    next(error);
  }
};
