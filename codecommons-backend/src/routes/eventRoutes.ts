import express from "express";
import { eventController } from "../controllers/eventController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", eventController.getAll);
router.get("/search", eventController.search);
router.get("/:id", eventController.getById);

// Protected routes
router.use(authenticateToken);
router.post("/", eventController.create);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.delete);
router.post("/:id/attend", eventController.toggleAttendance);

export default router;
