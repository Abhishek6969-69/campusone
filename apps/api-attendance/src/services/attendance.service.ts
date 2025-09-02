
import {prisma } from "@campusone/db";
import { AttendanceStatus } from "@prisma/client";

type BulkRecord = { studentId: string; status: AttendanceStatus };

// ✅ Mark single attendance
export const markAttendance = async (data: {
  studentId: string;
  professorId: string;
  classId: string;
  status: AttendanceStatus;
  date: Date;
  collegeId: string;
}) => {
  return await prisma.attendance.create({ data });
};

// ✅ Get attendance by student (college-scoped)
export const getAttendanceByStudent = async (studentId: string, collegeId: string) => {
  return await prisma.attendance.findMany({
    where: { studentId, collegeId },
    include: {
      class: { select: { id: true, code: true, name: true } },
      professor: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date: "desc" },
  });
};

// ✅ Bulk mark attendance
export const bulkMarkAttendance = async (
  classId: string,
  professorId: string,
  date: string,
  collegeId: string,
  records: BulkRecord[]
) => {
  return await prisma.attendance.createMany({
    data: records.map(r => ({
      studentId: r.studentId,
      professorId,
      classId,
      date: new Date(date),
      status: r.status,
      collegeId,
    })),
    skipDuplicates: true,
  });
};

// ✅ Attendance percentage for student
export const getAttendancePercentage = async (
  studentId: string,
  classId: string,
  collegeId: string
) => {
  const totalSessions = await prisma.attendance.findMany({
    where: { classId, collegeId },
    distinct: ["date"],
  });

  const total = totalSessions.length;

  const present = await prisma.attendance.findMany({
    where: { studentId, classId, collegeId, status: "PRESENT" },
    distinct: ["date"],
  });

  const presentCount = present.length;

  const percentage = total === 0 ? 0 : Math.round((presentCount / total) * 100);

  return {
    totalSessions: total,
    present: presentCount,
    absent: total - presentCount,
    percentage,
  };
};

// ✅ Attendance summary for class
export const getClassSummary = async (classId: string, collegeId: string) => {
  const totalSessions = await prisma.attendance.findMany({
    where: { classId, collegeId },
    distinct: ["date"],
  });

  const students = await prisma.attendance.groupBy({
    by: ["studentId"],
    where: { classId, collegeId },
    _count: { _all: true },
  });

  const result = await Promise.all(
    students.map(async s => {
      const presentCount = await prisma.attendance.count({
        where: { classId, studentId: s.studentId, collegeId, status: "PRESENT" },
      });

      const student = await prisma.user.findUnique({
        where: { id: s.studentId },
        select: { id: true, name: true, email: true },
      });

      return {
        ...student,
        present: presentCount,
        absent: s._count._all - presentCount,
        percentage: Math.round((presentCount / s._count._all) * 100),
      };
    })
  );

  return {
    classId,
    totalSessions: totalSessions.length,
    students: result,
  };
};
