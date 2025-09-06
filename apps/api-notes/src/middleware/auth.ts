import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {prisma} from "@campusone/db";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    collegeId: string;
  };
}

const DEV_USERS: Record<string, any> = {
  BOB: {
    id: "4c0618ef-4753-4907-bcab-d1fc51471f17",
    role: "STUDENT",
    email: "bob@jss.edu",
    collegeId: "7cf346c6-53e7-457a-831c-199bf0bbe153",
  },
//   RAJ: {
//     id: "raj-user-id-from-seed", // fill in from your seeding logs
//     role: "STUDENT",
//     email: "raj@iitd.ac.in",
//     collegeId: "iitd-college-id-from-seed",
//   },
};
// ✅ Authentication Middleware
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    // 🚨 DEV MODE: use fake user
    const userKey = process.env.DEV_USER || "BOB";
    req.user = DEV_USERS[userKey];
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    // For development, use the same hardcoded secret as NextAuth
    const JWT_SECRET = "1fa5a2ede80c596e194c53be8216445230f791c6964aa1dd9d7b9bee435985ab";
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      collegeId: string;
    };

    // Use the decoded token data directly since it's signed by NextAuth
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      collegeId: decoded.collegeId
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// ✅ Role-based Middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
};
