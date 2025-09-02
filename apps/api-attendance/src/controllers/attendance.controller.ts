import { Response } from "express";
import { AuthRequest } from "../middleware/auth.ts";
import * as attendanceService from "../services/attendance.service.ts";

// ✅ Bulk mark attendance
export const bulkMarkAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { professorId, date, records } = req.body;
    const { classId } = req.params;

    const result = await attendanceService.bulkMarkAttendance(
      classId,
      professorId,
      date,
      req.user!.collegeId,
      records
    );

    res.status(201).json({ count: result.count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Attendance percentage for student
export const getAttendancePercentage = async (req: AuthRequest, res: Response) => {
  try {
    const { id, classId } = req.params;

    const result = await attendanceService.getAttendancePercentage(
      id,
      classId,
      req.user!.collegeId
    );

    res.json({ studentId: id, classId, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Attendance summary for class
export const getClassSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { classId } = req.params;

    const summary = await attendanceService.getClassSummary(classId, req.user!.collegeId);
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark single attendance
export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, professorId, classId, status, date } = req.body;

    const attendance = await attendanceService.markAttendance({
      studentId,
      professorId,
      classId,
      status,
      date,
      collegeId: req.user!.collegeId,
    });

    res.status(201).json(attendance);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Student views their attendance
export const getAttendanceByStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await attendanceService.getAttendanceByStudent(
      id,
      req.user!.collegeId
    );

    // ✅ Always send an array
    res.json(Array.isArray(attendance) ? attendance : []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

