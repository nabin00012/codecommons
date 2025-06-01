import express from "express";
import {
  register,
  login,
  verifyToken,
  verifyTokenPost,
  getCurrentUser,
} from "../controllers/authController";
import { protect, AuthRequest, auth } from "../middleware/auth";
import { Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify", asyncHandler(auth), asyncHandler(verifyTokenPost));

// Protected routes
router.get("/verify", protect, verifyToken);
router.get("/me", protect, getCurrentUser);

export default router;
