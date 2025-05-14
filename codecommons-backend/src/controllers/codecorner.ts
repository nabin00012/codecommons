import { Request, Response } from "express";
import Question, { IAnswer } from "../models/Question";
import User from "../models/User";
import { Types } from "mongoose";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Get all questions
export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate("author", "name role semester department");
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};

// Create a new question
export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content, language, tags } = req.body;
    const userId = req.user._id;

    const question = new Question({
      title,
      content,
      language,
      tags: tags || [],
      author: userId,
      createdAt: new Date(),
      views: 0,
      votes: 0,
      answers: [],
    });

    await question.save();

    // Add points to the user
    await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });

    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Failed to create question" });
  }
};

// Get a single question
export const getQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name role semester department")
      .populate("answers.author", "name role semester department");

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Failed to fetch question" });
  }
};

// Delete a question
export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    // Only allow deletion by the author or a teacher
    if (
      question.author.toString() !== req.user._id.toString() &&
      req.user.role !== "teacher"
    ) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this question" });
      return;
    }

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Failed to delete question" });
  }
};

// Create an answer
export const createAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { content } = req.body;
    const questionId = req.params.id;
    const userId = req.user._id;

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const answer = {
      content,
      author: userId,
      createdAt: new Date(),
      votes: 0,
      isAccepted: false,
    };

    question.answers.push(answer);
    await question.save();

    // Add points to the user
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    res.status(201).json(answer);
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(500).json({ message: "Failed to create answer" });
  }
};

// Accept an answer
export const acceptAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: questionId, answerId } = req.params;

    // Only teachers can accept answers
    if (req.user.role !== "teacher") {
      res.status(403).json({ message: "Only teachers can accept answers" });
      return;
    }

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const answer = question.answers.find((a) => a._id.toString() === answerId);
    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    answer.isAccepted = true;
    await question.save();

    // Add points to the answer author
    await User.findByIdAndUpdate(answer.author, { $inc: { points: 15 } });

    res.json({ message: "Answer accepted successfully" });
  } catch (error) {
    console.error("Error accepting answer:", error);
    res.status(500).json({ message: "Failed to accept answer" });
  }
};

// Vote on a question
export const voteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    question.votes += 1;
    await question.save();

    // Add points to the question author
    await User.findByIdAndUpdate(question.author, { $inc: { points: 2 } });

    res.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error voting on question:", error);
    res.status(500).json({ message: "Failed to record vote" });
  }
};

// Vote on an answer
export const voteAnswer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const question = await Question.findOne({ "answers._id": req.params.id });
    if (!question) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    const answer = question.answers.find(
      (a) => a._id.toString() === req.params.id
    );
    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    answer.votes += 1;
    await question.save();

    // Add points to the answer author
    await User.findByIdAndUpdate(answer.author, { $inc: { points: 2 } });

    res.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error voting on answer:", error);
    res.status(500).json({ message: "Failed to record vote" });
  }
};
