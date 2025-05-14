import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  getCurrentUser,
} from "../controllers/authController";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validate,
} from "../middleware/validation";
import { protect } from "../middleware/auth";

const router = express.Router();

// Apply validation middleware to routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/verify", protect, verifyToken);
router.get("/me", protect, getCurrentUser);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword
);
router.post(
  "/reset-password/:resetToken",
  resetPasswordValidation,
  validate,
  resetPassword
);

export default router;
