import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Middleware } from "../types/middleware";
import { CustomJwtPayload } from "../types/jwt";
import User from "../models/User";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect: Middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as CustomJwtPayload;

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      next({ status: 401, message: "Not authorized, token failed" });
    }
    return;
  }

  if (!token) {
    next({ status: 401, message: "Not authorized, no token" });
  }
};

// Middleware to check if user is a teacher
export const teacherOnly: Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    next({ status: 403, message: "Not authorized as a teacher" });
  }
};
