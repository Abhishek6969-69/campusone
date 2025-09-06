"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AttendanceTable from "./AttendanceTable";
import SubjectAttendanceTable from "./SubjectAttendanceTable";

interface Props {
  classId: string;
}

export default function AttendanceView({ classId }: Props) {
  const { data: session } = useSession();
  const [view, setView] = useState<"take" | "view">("take");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setView("take")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === "take"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Take Attendance
          </button>
          <button
            onClick={() => setView("view")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === "view"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            View Records
          </button>
        </div>
      </div>

      {view === "take" ? (
        <AttendanceTable classId={classId} />
      ) : (
        <SubjectAttendanceTable classId={classId} />
      )}
    </div>
  );
}
