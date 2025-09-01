import { Request, Response } from "express";
import * as attendanceService from "../services/attendance.service.ts";


export const bulkMarkAttendance = async (req: Request, res: Response) => {
  try {
    const { professorId, date, records } = req.body;
    const { classId } = req.params;

    const result = await attendanceService.bulkMarkAttendance(classId, professorId, date, records);
    res.status(201).json({ count: result.count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const getAttendancePercentage = async (req: Request, res: Response) => {
  try {
    const { id, classId } = req.params;
    const result = await attendanceService.getAttendancePercentage(id, classId);
    res.json({
      studentId: id,
      classId,
      ...result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};



export const getClassSummary = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const summary = await attendanceService.getClassSummary(classId);
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
