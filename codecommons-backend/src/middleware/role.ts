import { Request, Response, NextFunction } from "express";

export function roleMiddleware(role: "teacher" | "student") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Not authorized as a ${role}` });
    }
    next();
  };
}
