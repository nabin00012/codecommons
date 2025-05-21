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

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

export const protect: Middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  console.log("Protect middleware called");
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);

  // Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token found in cookies:", token.substring(0, 10) + "...");
  }
  // Then check for token in headers
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token found in header:", token.substring(0, 10) + "...");
  }

  if (!token) {
    console.log("No token found in request");
    next({ status: 401, message: "Not authorized, no token" });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as CustomJwtPayload;
    console.log("Token decoded:", decoded);

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user ? user._id : "No user found");

    if (!user) {
      console.log("No user found for token");
      next({ status: 401, message: "Not authorized, user not found" });
      return;
    }

    req.user = user;
    console.log("User attached to request:", req.user._id);
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    next({ status: 401, message: "Not authorized, token failed" });
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

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Error verifying token" });
  }
};
