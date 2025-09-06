"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ClassSelect from "@/components/ClassSelect";
import AttendanceView from "@/components/AttendanceView";

export default function AttendancePage() {
  const { data: session } = useSession();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Please sign in to access this page
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Attendance Management
      </h1>

      <div className="space-y-8">
        <div className="max-w-xl">
          <ClassSelect
            onClassSelect={(classId) => setSelectedClassId(classId)}
            selectedClassId={selectedClassId}
          />
        </div>

        {selectedClassId && (
          <AttendanceView classId={selectedClassId} />
        )}
      </div>
    </div>
  );
}
