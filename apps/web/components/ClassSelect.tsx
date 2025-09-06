"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Class {
  id: string;
  name: string;
  code: string;
}

interface Props {
  onClassSelect: (classId: string) => void;
  selectedClassId?: string;
}

export default function ClassSelect({ onClassSelect, selectedClassId }: Props) {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Get session token
        if (!session) throw new Error("No active session");
        const token = (session as any)?.accessToken || session.user?.accessToken;
        if (!token) throw new Error("No access token");

        // Make authenticated request
        const res = await fetch("http://localhost:4001/classes/teaching", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          console.error('Classes API error:', await res.text());
          throw new Error("Failed to fetch classes");
        }
        
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        setError("Failed to load classes");
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchClasses();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <select
        value={selectedClassId || ""}
        onChange={(e) => onClassSelect(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100
                 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.code} - {cls.name}
          </option>
        ))}
      </select>
    </div>
  );
}
