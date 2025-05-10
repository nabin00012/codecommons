import { Request, Response, NextFunction } from "express";
import { Middleware } from "../types/middleware";

export const roleMiddleware = (role: string): Middleware => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      next({ status: 403, message: `Not authorized as a ${role}` });
    }
  };
};
