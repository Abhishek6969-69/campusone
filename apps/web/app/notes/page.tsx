"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import NotesList from "../components/NotesList";

export default function NotesPage() {
  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200 transition-colors">
      <h1 className="text-2xl font-bold mb-6">📘 All Notes</h1>

      {!notes ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <NotesList notes={notes} />
      )}
    </div>
  );
}
