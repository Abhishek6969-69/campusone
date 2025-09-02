import { Router } from "express";
import {
  getAttendanceByStudent,
  bulkMarkAttendance,
  getAttendancePercentage,
  getClassSummary,
  markAttendance,
} from "../controllers/attendance.controller.ts";
import { authMiddleware, requireRole } from "../middleware/auth.ts";

const router = Router();

// ✅ All attendance routes require authentication
router.use(authMiddleware);

// Students: view attendance
router.get("/student/:id", requireRole(["STUDENT", "PROFESSOR", "ADMIN"]), getAttendanceByStudent);

// Students: view % (their own attendance)
router.get("/student/:id/percentage/:classId", requireRole(["STUDENT", "PROFESSOR", "ADMIN"]), getAttendancePercentage);

// Professors/Admins: bulk mark attendance
router.post("/class/:classId/mark", requireRole(["PROFESSOR", "ADMIN"]), bulkMarkAttendance);

// Professors/Admins: single mark attendance
router.post("/mark", requireRole(["PROFESSOR", "ADMIN"]), markAttendance);

// Professors/Admins: class summary
router.get("/class/:classId/summary", requireRole(["PROFESSOR", "ADMIN"]), getClassSummary);

export default router;
