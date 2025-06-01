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

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { id: string };

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is a teacher
export const teacherOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as teacher" });
  }
};

// Middleware to check if user is authenticated (for POST /verify)
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header or cookie
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    console.log("Auth middleware - Token from header:", authHeader);
    console.log("Auth middleware - Token from cookie:", req.cookies?.token);
    console.log("Auth middleware - Using token:", token);

    if (!token) {
      console.log("Auth middleware - No token provided");
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as any;
      console.log("Auth middleware - Decoded token:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log("Auth middleware - User not found");
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      console.log("Auth middleware - User found:", user.email);
      req.user = user;
      next();
    } catch (err) {
      console.log("Auth middleware - Token verification failed:", err);
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
  } catch (error) {
    console.log("Auth middleware - Error:", error);
    res.status(401).json({ success: false, message: "Authentication failed" });
    return;
  }
};
