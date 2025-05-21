import express from "express";
import { discussionController } from "../controllers/discussionController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", discussionController.getAll);
router.get("/search", discussionController.search);
router.get("/:id", discussionController.getById);

// Protected routes
router.use(authenticateToken);
router.post("/", discussionController.create);
router.post("/:id/comments", discussionController.addComment);
router.post("/:id/like", discussionController.toggleLike);

export default router;
