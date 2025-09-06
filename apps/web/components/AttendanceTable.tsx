"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface AttendanceRecord {
  studentId: string;
  status: "PRESENT" | "ABSENT";
  date: string;
}

interface Props {
  classId: string;
  onSuccess?: () => void;
}

export default function AttendanceTable({ classId, onSuccess }: Props) {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    // Fetch students for the class
    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/classes/${classId}/students`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
        
        // Initialize all students as present
        const initial = data.reduce((acc: { [key: string]: boolean }, student: Student) => {
          acc[student.id] = true; // true = present, false = absent
          return acc;
        }, {});
        setAttendance(initial);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [classId]);

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    setIsSubmitting(true);

    try {
      const records: AttendanceRecord[] = Object.entries(attendance).map(([studentId, isPresent]) => ({
        studentId,
        status: isPresent ? "PRESENT" : "ABSENT",
        date: date ?? "",
      }));

      const res = await fetch(`/api/attendance/${classId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professorId: session.user.id,
          date,
          records,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit attendance");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {student.rollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      attendance[student.id]
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {attendance[student.id] ? "Present" : "Absent"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
