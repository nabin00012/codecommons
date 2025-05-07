import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validate,
} from "../middleware/validation";

const router = express.Router();

// Apply validation middleware to routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
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
