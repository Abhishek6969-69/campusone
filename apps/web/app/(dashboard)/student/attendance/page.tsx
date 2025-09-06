"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AttendanceView from "@/components/AttendanceView";

export default function StudentAttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "STUDENT") {
    router.push("/");
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Attendance
      </h1>

      {classes.map((cls) => (
        <div key={cls.id} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {cls.name}
          </h2>
          <AttendanceView classId={cls.id} studentId={session.user.id} />
        </div>
      ))}
    </div>
  );
}
