import { NextFunction, Request, Response } from "express";
import admin from "../../infrastructure/config/firebase.config.js";

export const requireUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionCookie = req.cookies?.session;

    if (!sessionCookie) {
      return res.status(401).json({ message: "No session" });
    }

    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true); // true = check revoked

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: "user",
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired or revoked" });
  }
};
