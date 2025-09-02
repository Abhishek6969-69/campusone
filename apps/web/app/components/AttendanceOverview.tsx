"use client";

export default function AttendanceOverview({ attendance }: { attendance: any[] }) {
  const total = attendance?.length || 0;
  const present = attendance?.filter((r: any) => r.status === "PRESENT").length || 0;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="mb-6 p-4 rounded-xl shadow bg-white dark:bg-gray-800 flex flex-col items-center transition-colors">
      <h2 className="text-lg font-semibold mb-2">📊 Overall Attendance</h2>
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
        {percentage}%
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {present}/{total} classes attended
      </p>
    </div>
  );
}
