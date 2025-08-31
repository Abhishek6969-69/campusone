import express from "express";
import type { Request, Response } from "express";   
import cors from "cors";
import dotenv from "dotenv";
import prisma from '@campusone/db';
 // Removed because module not found
 export const getAttendanceByStudent = async (studentId: string) => {
  return await prisma.attendance.findMany({
    where: { studentId }
  });
};
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ service: "attendance", status: "running" });
});

// Example route for marking attendance
app.post("/attendance/mark", (req: Request, res: Response) => {
  const { studentId, classId, date, status } = req.body;
  // In real setup → save to DB
  res.json({ message: "Attendance marked", studentId, classId, date, status });
});

// Example route for professor's view
app.get("/attendance/professor/:id/today", (req: Request, res: Response) => {
  const { id } = req.params;
  // Mock data, in real case → fetch from DB
  res.json({
    professorId: id,
    date: new Date().toISOString().split("T")[0],
    students: [
      { studentId: "101", name: "Alice", status: "present" },
      { studentId: "102", name: "Bob", status: "absent" },
      { studentId: "103", name: "Carol", status: "present" }
    ]
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Attendance API running on port ${PORT}`));
