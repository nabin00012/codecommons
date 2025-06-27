"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const codecorner_1 = require("../controllers/codecorner");
const router = express_1.default.Router();
// Questions
router.get("/questions", auth_1.protect, codecorner_1.getQuestions);
router.get("/questions/:id", auth_1.protect, codecorner_1.getQuestion);
router.post("/questions", auth_1.protect, codecorner_1.createQuestion);
router.delete("/questions/:id", auth_1.protect, codecorner_1.deleteQuestion);
// Answers
router.post("/questions/:id/answers", auth_1.protect, codecorner_1.createAnswer);
router.post("/questions/:id/answers/:answerId/accept", auth_1.protect, codecorner_1.acceptAnswer);
// Votes
router.post("/questions/:id/vote", auth_1.protect, codecorner_1.voteQuestion);
router.post("/answers/:id/vote", auth_1.protect, codecorner_1.voteAnswer);
exports.default = router;
