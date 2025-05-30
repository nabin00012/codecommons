import express from "express";
import {
  register,
  login,
  verifyToken,
  getCurrentUser,
} from "../controllers/authController";
import { protect, AuthRequest } from "../middleware/auth";
import { Response, NextFunction } from "express";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get(
  "/verify",
  protect,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    verifyToken(req, res, next).catch(next);
  }
);

router.get(
  "/me",
  protect,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    getCurrentUser(req, res, next).catch(next);
  }
);

export default router;
