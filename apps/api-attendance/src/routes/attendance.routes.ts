import { Router } from "express";
import {
  bulkMarkAttendance,
  getAttendancePercentage,
  getClassSummary
} from "../controllers/attendance.controller.ts";

const router = Router();

// Routes
router.post("/class/:classId/mark", bulkMarkAttendance);
router.get("/student/:id/percentage/:classId", getAttendancePercentage);
router.get("/class/:classId/summary", getClassSummary);

export default router;
