"use client";

import { useState, useMemo } from "react";

type Note = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  uploadedAt: string;
  professor?: {
    id: string;
    name: string;
  };
};

export default function NotesList({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");

  // 🔎 Filter notes based on search query
  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, notes]);

  return (
    <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800 transition-colors">
      <h2 className="text-xl font-semibold mb-4">📘 Notes</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notes found</p>
      ) : (
        <ul className="space-y-3">
          {filteredNotes.map((note) => (
            <li
              key={note.id}
              className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col">
                <a
                  href={note.fileUrl}
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {note.title}
                </a>
                {note.description && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {note.description}
                  </span>
                )}
                {note.professor && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Uploaded by {note.professor.name}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(note.uploadedAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
