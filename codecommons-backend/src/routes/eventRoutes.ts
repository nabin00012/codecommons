import express, { RequestHandler } from "express";
import { eventController } from "../controllers/eventController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", eventController.getAll as RequestHandler);
router.get("/search", eventController.search as RequestHandler);
router.get("/:id", eventController.getById as RequestHandler);

// Protected routes
router.use(protect as RequestHandler);
router.post("/", eventController.create as RequestHandler);
router.put("/:id", eventController.update as RequestHandler);
router.delete("/:id", eventController.delete as RequestHandler);
router.post("/:id/attend", eventController.toggleAttendance as RequestHandler);

export default router;
