"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvents, getNotes } from "@/lib/api";
import EventForm from "@/components/EventForm";
import NoteUploadForm from "@/components/NoteUploadForm";

export default function ProfessorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isUploadNoteOpen, setIsUploadNoteOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signup");
      return;
    }
    if (session.user.role !== "PROFESSOR") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  // Fetch events and notes
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  // Loading state
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

  if (!session || session.user.role !== "PROFESSOR") {
    return null;
  }

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">👨‍🏫 Professor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {session.user.name}!
          </p>
        </div>
        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
          <p>{session.user.collegeName}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => setIsAddEventOpen(true)}
          className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">➕ Create Event</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Schedule a new event or activity
          </p>
        </button>

        <button
          onClick={() => setIsUploadNoteOpen(true)}
          className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">📄 Upload Notes</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Share study materials with students
          </p>
        </button>

        <button
          onClick={() => router.push("/attendance")}
          className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">✅ Mark Attendance</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Take attendance for your classes
          </p>
        </button>
      </div>

      {/* Recent Events */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📅 Recent Events</h2>
            <button
              onClick={() => router.push("/events")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All →
            </button>
          </div>
          {events.length === 0 ? (
            <p className="text-gray-400">No events</p>
          ) : (
            <ul className="space-y-2">
              {events.slice(0, 5).map((event: any) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
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

        {/* Recent Notes */}
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📚 Recent Notes</h2>
            <button
              onClick={() => router.push("/notes")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All →
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-gray-400">No notes uploaded</p>
          ) : (
            <ul className="space-y-2">
              {notes.slice(0, 5).map((note: any) => (
                <li
                  key={note.id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {note.title}
                  </a>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(note.uploadedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <EventForm
              onClose={() => setIsAddEventOpen(false)}
              onSuccess={() => {
                // Refetch events
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

      {/* Upload Notes Modal */}
      {isUploadNoteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Upload Notes</h2>
            <NoteUploadForm
              onClose={() => setIsUploadNoteOpen(false)}
              onSuccess={() => {
                // Refetch notes
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
