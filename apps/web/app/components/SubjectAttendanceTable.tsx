"use client";

type AttendanceRecord = {
  id: string;
  status: "PRESENT" | "ABSENT";
  date: string;
  class: {
    id: string;
    code: string;
    name: string;
  };
};

export default function SubjectAttendanceTable({
  attendance = [],
}: {
  attendance?: AttendanceRecord[];
}) {
  const subjectStats: Record<string, { present: number; total: number; code: string }> = {};

  (attendance || []).forEach((rec: AttendanceRecord) => {
    if (!rec || !rec.class) return;

    const key = rec.class.id;
    if (!subjectStats[key]) {
      subjectStats[key] = { present: 0, total: 0, code: rec.class.code };
    }

    subjectStats[key].total++;
    if (rec.status === "PRESENT") {
      subjectStats[key].present++;
    }
  });

  return (
    <div className="mb-6 p-4 rounded-xl shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4">📘 Subject-wise Attendance</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="p-2">Subject</th>
            <th className="p-2">Code</th>
            <th className="p-2">Attended</th>
            <th className="p-2">Total</th>
            <th className="p-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(subjectStats).map(([classId, stats]) => {
            const percent =
              stats.total > 0
                ? Math.round((stats.present / stats.total) * 100)
                : 0;

            return (
              <tr key={classId} className="border-b dark:border-gray-700">
                <td className="p-2">{attendance.find((r) => r.class.id === classId)?.class.name}</td>
                <td className="p-2">{stats.code}</td>
                <td className="p-2">{stats.present}</td>
                <td className="p-2">{stats.total}</td>
                <td
                  className={`p-2 font-semibold ${
                    percent >= 75
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {percent}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
