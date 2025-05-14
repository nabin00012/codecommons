import express from "express";
import { protect } from "../middleware/auth";
import {
  getQuestions,
  createQuestion,
  getQuestion,
  deleteQuestion,
  createAnswer,
  acceptAnswer,
  voteQuestion,
  voteAnswer,
} from "../controllers/codecorner";

const router = express.Router();

// Questions
router.get("/questions", protect, getQuestions);
router.post("/questions", protect, createQuestion);
router.get("/questions/:id", protect, getQuestion);
router.delete("/questions/:id", protect, deleteQuestion);

// Answers
router.post("/questions/:id/answers", protect, createAnswer);
router.post("/questions/:id/answers/:answerId/accept", protect, acceptAnswer);

// Votes
router.post("/questions/:id/vote", protect, voteQuestion);
router.post("/answers/:id/vote", protect, voteAnswer);

export default router;
