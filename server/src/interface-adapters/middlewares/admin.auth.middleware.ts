import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../../types/jwt.js";

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({ message: "No admin token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    req.admin = {
      id: decoded.id,
      email: decoded.username,
      role: "admin",
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};