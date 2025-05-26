import express, { RequestHandler } from "express";
import { groupController } from "../controllers/groupController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", groupController.getAll as RequestHandler);
router.get("/search", groupController.search as RequestHandler);
router.get("/:id", groupController.getById as RequestHandler);

// Protected routes
router.use(protect as RequestHandler);
router.get("/user/groups", groupController.getUserGroups as RequestHandler);
router.post("/", groupController.create as RequestHandler);
router.put("/:id", groupController.update as RequestHandler);
router.delete("/:id", groupController.delete as RequestHandler);
router.post("/:id/join", groupController.toggleMembership as RequestHandler);

export default router;
