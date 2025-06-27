"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteAnswer = exports.voteQuestion = exports.acceptAnswer = exports.createAnswer = exports.deleteQuestion = exports.getQuestion = exports.createQuestion = exports.getQuestions = void 0;
const Question_1 = __importStar(require("../models/Question"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
// Get all questions
const getQuestions = async (req, res) => {
    try {
        const questions = await Question_1.default.find()
            .sort({ createdAt: -1 })
            .populate("author", "name role semester department");
        res.json(questions);
    }
    catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: "Failed to fetch questions" });
    }
};
exports.getQuestions = getQuestions;
// Create a new question
const createQuestion = async (req, res) => {
    try {
        const { title, content, language, tags } = req.body;
        const userId = req.user._id;
        const question = new Question_1.default({
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
        await User_1.default.findByIdAndUpdate(userId, { $inc: { points: 5 } });
        res.status(201).json(question);
    }
    catch (error) {
        console.error("Error creating question:", error);
        res.status(500).json({ message: "Failed to create question" });
    }
};
exports.createQuestion = createQuestion;
// Get a single question
const getQuestion = async (req, res) => {
    try {
        console.log("Fetching question with ID:", req.params.id);
        // Validate ID format
        if (!mongoose_1.Types.ObjectId.isValid(req.params.id)) {
            console.error("Invalid question ID format:", req.params.id);
            res.status(400).json({
                message: "Invalid question ID format",
                id: req.params.id,
            });
            return;
        }
        console.log("Finding question in database...");
        // First find the question
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            console.error("Question not found with ID:", req.params.id);
            res.status(404).json({
                message: "Question not found",
                id: req.params.id,
            });
            return;
        }
        // Then find all answers for this question
        const answers = await Question_1.Answer.find({ question: question._id })
            .populate("author", "name role semester department email")
            .sort({ createdAt: -1 }); // Sort by newest first
        // Increment view count
        await Question_1.default.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        // Get the populated question
        const populatedQuestion = await Question_1.default.findById(req.params.id)
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
        console.log("Sending response with transformed question data:", JSON.stringify(transformedQuestion, null, 2));
        res.json(transformedQuestion);
    }
    catch (error) {
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
exports.getQuestion = getQuestion;
// Delete a question
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        // Only allow deletion by the author or a teacher
        if (question.author.toString() !== req.user._id.toString() &&
            req.user.role !== "teacher") {
            res
                .status(403)
                .json({ message: "Not authorized to delete this question" });
            return;
        }
        await question.deleteOne();
        res.json({ message: "Question deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Failed to delete question" });
    }
};
exports.deleteQuestion = deleteQuestion;
// Create an answer
const createAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const questionId = req.params.id;
        const userId = req.user._id;
        const question = await Question_1.default.findById(questionId);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        // Create a new answer
        const answer = new Question_1.Answer({
            content,
            author: userId,
            question: questionId,
            createdAt: new Date(),
            votes: 0,
            isAccepted: false,
        });
        await answer.save();
        // Add points to the user
        await User_1.default.findByIdAndUpdate(userId, { $inc: { points: 10 } });
        // Fetch the populated answer to return
        const populatedAnswer = await Question_1.Answer.findById(answer._id)
            .populate("author", "name role semester department email")
            .lean();
        res.status(201).json(populatedAnswer);
    }
    catch (error) {
        console.error("Error creating answer:", error);
        res.status(500).json({ message: "Failed to create answer" });
    }
};
exports.createAnswer = createAnswer;
// Accept an answer
const acceptAnswer = async (req, res) => {
    try {
        const { id: questionId, answerId } = req.params;
        // Only teachers can accept answers
        if (req.user.role !== "teacher") {
            res.status(403).json({ message: "Only teachers can accept answers" });
            return;
        }
        const answer = await Question_1.Answer.findById(answerId);
        if (!answer) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }
        answer.isAccepted = true;
        await answer.save();
        // Add points to the answer author
        await User_1.default.findByIdAndUpdate(answer.author, { $inc: { points: 15 } });
        res.json({ message: "Answer accepted successfully" });
    }
    catch (error) {
        console.error("Error accepting answer:", error);
        res.status(500).json({ message: "Failed to accept answer" });
    }
};
exports.acceptAnswer = acceptAnswer;
// Vote on a question
const voteQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        question.votes += 1;
        await question.save();
        // Add points to the question author
        await User_1.default.findByIdAndUpdate(question.author, { $inc: { points: 2 } });
        res.json({ message: "Vote recorded successfully" });
    }
    catch (error) {
        console.error("Error voting on question:", error);
        res.status(500).json({ message: "Failed to record vote" });
    }
};
exports.voteQuestion = voteQuestion;
// Vote on an answer
const voteAnswer = async (req, res) => {
    try {
        const answer = await Question_1.Answer.findById(req.params.id);
        if (!answer) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }
        answer.votes += 1;
        await answer.save();
        // Add points to the answer author
        await User_1.default.findByIdAndUpdate(answer.author, { $inc: { points: 2 } });
        res.json({ message: "Vote recorded successfully" });
    }
    catch (error) {
        console.error("Error voting on answer:", error);
        res.status(500).json({ message: "Failed to record vote" });
    }
};
exports.voteAnswer = voteAnswer;
