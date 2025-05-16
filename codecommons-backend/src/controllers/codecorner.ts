import { Request, Response } from "express";
import Question, {
  IQuestion,
  IAnswer,
  Answer,
  IPopulatedQuestion,
} from "../models/Question";
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
    console.log("Fetching question with ID:", req.params.id);

    // Validate ID format
    if (!Types.ObjectId.isValid(req.params.id)) {
      console.error("Invalid question ID format:", req.params.id);
      res.status(400).json({
        message: "Invalid question ID format",
        id: req.params.id,
      });
      return;
    }

    console.log("Finding question in database...");
    // First find the question
    const question = await Question.findById(req.params.id);

    if (!question) {
      console.error("Question not found with ID:", req.params.id);
      res.status(404).json({
        message: "Question not found",
        id: req.params.id,
      });
      return;
    }

    // Then find all answers for this question
    const answers = await Answer.find({ question: question._id })
      .populate("author", "name role semester department email")
      .sort({ createdAt: -1 }); // Sort by newest first

    // Increment view count
    await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Get the populated question
    const populatedQuestion = await Question.findById(req.params.id)
      .populate("author", "name role semester department email")
      .lean();

    if (!populatedQuestion) {
      console.error("Error: Question disappeared after initial fetch");
      res.status(500).json({
        message: "Error fetching question details",
      });
      return;
    }

    // Transform the data to ensure all ObjectIds are strings
    const transformedQuestion = {
      ...populatedQuestion,
      _id: populatedQuestion._id.toString(),
      author: populatedQuestion.author
        ? {
            ...populatedQuestion.author,
            _id: populatedQuestion.author._id.toString(),
          }
        : null,
      answers: answers.map((answer) => ({
        ...answer.toObject(),
        _id: answer._id.toString(),
        author: answer.author
          ? {
              ...answer.author,
              _id: answer.author._id.toString(),
            }
          : null,
      })),
    };

    // Log the transformed data
    console.log(
      "Sending response with transformed question data:",
      JSON.stringify(transformedQuestion, null, 2)
    );

    res.json(transformedQuestion);
  } catch (error) {
    console.error("Error fetching question:", error);
    // Log the full error stack trace
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    res.status(500).json({
      message: "Failed to fetch question",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
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

    // Create a new answer
    const answer = new Answer({
      content,
      author: userId,
      question: questionId,
      createdAt: new Date(),
      votes: 0,
      isAccepted: false,
    });

    await answer.save();

    // Add points to the user
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    // Fetch the populated answer to return
    const populatedAnswer = await Answer.findById(answer._id)
      .populate("author", "name role semester department email")
      .lean();

    res.status(201).json(populatedAnswer);
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

    const answer = await Answer.findById(answerId);
    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    answer.isAccepted = true;
    await answer.save();

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
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    answer.votes += 1;
    await answer.save();

    // Add points to the answer author
    await User.findByIdAndUpdate(answer.author, { $inc: { points: 2 } });

    res.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error voting on answer:", error);
    res.status(500).json({ message: "Failed to record vote" });
  }
};
