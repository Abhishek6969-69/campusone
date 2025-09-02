"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentAttendance, getEvents, getNotes } from "@/lib/api";
import SubjectAttendanceTable from "../../components/SubjectAttendanceTable";

export default function StudentDashboard() {
  // 🚨 For demo, use seeded Bob (JSS) or Raj (IITD)
  // Later: replace with `session.user.id` from NextAuth
  const studentId = "4c0618ef-4753-4907-bcab-d1fc51471f17"; // Bob (JSS)
  // const studentId = "raj-student-id-from-seed"; // Raj (IITD)

  // Attendance
  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance", studentId],
    queryFn: () => getStudentAttendance(studentId),
  });

  // Events (college scoped automatically via backend)
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // Notes (college scoped)
  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  // Attendance stats
  const total = attendance.length;
  const present = attendance.filter((r: any) => r.status === "PRESENT").length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200 transition-colors">
      <h1 className="text-2xl font-bold mb-6">🎓 Student Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Attendance Card */}
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-2">Attendance</h2>
          <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Overall attendance rate
          </p>
        </div>

        {/* Events */}
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-400">No events</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event: any) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1"
                >
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notes */}
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-400">No notes available</p>
          ) : (
            <>
              <ul className="space-y-2">
                {notes.slice(0, 3).map((note: any) => (
                  <li key={note.id}>
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {note.title}
                    </a>
                  </li>
                ))}
              </ul>
              {notes.length > 3 && (
                <div className="mt-3">
                  <a
                    href="/notes"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all notes →
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <SubjectAttendanceTable attendance={attendance} />

      {/* Attendance History */}
      <div className="mt-6 p-4 rounded-xl shadow bg-white dark:bg-gray-800 transition-colors">
        <h2 className="text-lg font-semibold mb-2">Attendance History</h2>
        {attendance.length === 0 ? (
          <p className="text-gray-400">No records</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="p-2">Date</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec: any) => (
                <tr
                  key={rec.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="p-2">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {rec.class.code} - {rec.class.name}
                  </td>
                  <td
                    className={`p-2 font-semibold ${
                      rec.status === "PRESENT"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {rec.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
