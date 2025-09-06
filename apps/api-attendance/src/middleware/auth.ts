import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    collegeId: string;
    email: string;
  };
}

const DEV_USERS: Record<string, any> = {
  BOB: {
    id: "4c0618ef-4753-4907-bcab-d1fc51471f17",
    role: "STUDENT",
    email: "bob@jss.edu",
    collegeId: "7cf346c6-53e7-457a-831c-199bf0bbe153",
  },
};

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development" && process.env.USE_DEV_USER === "true") {
    // 🚨 DEV MODE: use fake user only if explicitly enabled
    const userKey = process.env.DEV_USER || "BOB";
    req.user = DEV_USERS[userKey];
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    // Verify JWT token from Next.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
      email: string;
      collegeId: string;
    };

    // We can trust the token since it's signed by Next.js
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      collegeId: decoded.collegeId,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
};