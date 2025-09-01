import prisma from "@campusone/db";

type BulkRecord = { studentId: string; status: string };

// ✅ Bulk mark attendance
export const bulkMarkAttendance = async (
  classId: string,
  professorId: string,
  date: string,
  records: BulkRecord[]
) => {
  return await prisma.attendance.createMany({
    data: records.map(r => ({
      studentId: r.studentId,
      professorId,
      classId,
      date: new Date(date),
      status: r.status as any
    })),
    skipDuplicates: true
  });
};

// ✅ Attendance percentage for student
// ✅ Attendance percentage for student (with counts)
export const getAttendancePercentage = async (studentId: string, classId: string) => {
  // count how many sessions total
  const totalSessions = await prisma.attendance.findMany({
    where: { classId },
    distinct: ["date"]
  });

  const total = totalSessions.length;

  // count how many sessions the student was present
  const present = await prisma.attendance.findMany({
    where: { studentId, classId, status: "PRESENT" },
    distinct: ["date"]
  });

  const presentCount = present.length;

  const percentage = total === 0 ? 0 : Math.round((presentCount / total) * 100);

  return {
    totalSessions: total,
    present: presentCount,
    absent: total - presentCount,
    percentage
  };
};


// ✅ Attendance summary for class
export const getClassSummary = async (classId: string) => {
  const totalSessions = await prisma.attendance.findMany({
    where: { classId },
    distinct: ["date"]
  });

  const students = await prisma.attendance.groupBy({
    by: ["studentId"],
    where: { classId },
    _count: { _all: true }
  });

  // fetch student details + presence count
  const result = await Promise.all(
    students.map(async s => {
      const presentCount = await prisma.attendance.count({
        where: { classId, studentId: s.studentId, status: "PRESENT" }
      });

      const student = await prisma.user.findUnique({
        where: { id: s.studentId },
        select: { id: true, name: true, email: true }
      });

      return {
        ...student,
        present: presentCount,
        absent: s._count._all - presentCount,
        percentage: Math.round((presentCount / s._count._all) * 100)
      };
    })
  );

  return {
    classId,
    totalSessions: totalSessions.length,
    students: result
  };
};
