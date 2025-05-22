import express, { RequestHandler } from "express";
import { discussionController } from "../controllers/discussionController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", discussionController.getAll as RequestHandler);
router.get("/search", discussionController.search as RequestHandler);
router.get("/:id", discussionController.getById as RequestHandler);

// Protected routes
router.use(authenticateToken as RequestHandler);
router.post("/", discussionController.create as RequestHandler);
router.post("/:id/comments", discussionController.addComment as RequestHandler);
router.post("/:id/like", discussionController.toggleLike as RequestHandler);

export default router;
