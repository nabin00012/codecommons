import { Request, Response, NextFunction } from "express";
import { ValidationChain } from "express-validator";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type ValidationMiddleware = ValidationChain[];
