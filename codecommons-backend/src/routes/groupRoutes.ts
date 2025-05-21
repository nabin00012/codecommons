import express from "express";
import { groupController } from "../controllers/groupController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", groupController.getAll);
router.get("/search", groupController.search);
router.get("/:id", groupController.getById);

// Protected routes
router.use(authenticateToken);
router.post("/", groupController.create);
router.put("/:id", groupController.update);
router.delete("/:id", groupController.delete);
router.post("/:id/join", groupController.toggleMembership);
router.get("/user/groups", groupController.getUserGroups);

export default router;
