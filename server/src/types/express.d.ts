import "express";

declare global {
  namespace Express {
    interface User {
      uid: string;
      email?: string;
      role: "user";
    }

    interface Admin {
      id: string;
      email?: string;
      role: "admin";
    }

    interface Request {
      user?: User;
      admin?: Admin;
    }
  }
}