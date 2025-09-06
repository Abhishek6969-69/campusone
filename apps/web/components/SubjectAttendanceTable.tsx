"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT";
  student: {
    id: string;
    name: string;
    rollNo: string;
  };
}

interface Props {
  classId: string;
}

export default function SubjectAttendanceTable({ classId }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`/api/attendance/${classId}/summary`);
        if (!res.ok) throw new Error("Failed to fetch attendance records");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        setError("Failed to load attendance records");
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchAttendance();
    }
  }, [classId]);

  if (!classId) {
    return null;
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {error}
      </div>
    );
  }

  // Group records by student
  const studentRecords = records.reduce((acc, record) => {
    const { student, ...rest } = record;
    if (!acc[student.id]) {
      acc[student.id] = {
        student,
        records: [],
      };
    }
    acc[student.id]?.records.push(rest);
    return acc;
  }, {} as { [key: string]: { student: AttendanceRecord["student"]; records: Omit<AttendanceRecord, "student">[] } });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Roll No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Present Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Total Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.values(studentRecords).map(({ student, records }) => {
            const totalDays = records.length;
            const presentDays = records.filter(r => r.status === "PRESENT").length;
            const percentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(1) : "0";
            
            return (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {student.rollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {presentDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {totalDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      Number(percentage) >= 75
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {percentage}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
