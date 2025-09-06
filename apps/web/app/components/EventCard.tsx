"use client";

import { useState } from "react";

type RSVPStatus = "PENDING" | "ACCEPTED" | "DECLINED";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  createdBy: string;
  creator: {
    name: string;
  };
}

export default function EventCard({
  id,
  title,
  description,
  date,
  creator,
}: Event) {
  const [status, setStatus] = useState<RSVPStatus>("PENDING");

  const handleRSVP = async () => {
    try {
      const newStatus = status === "PENDING" ? "ACCEPTED" : 
                       status === "ACCEPTED" ? "DECLINED" : "PENDING";
      
      const res = await fetch(`/api/events/${id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Error updating RSVP:", error);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-800 transition hover:shadow-lg">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-3">
          {description}
        </p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Created by {creator.name}
      </p>

      <button
        onClick={handleRSVP}
        className={`w-full py-2 rounded-lg font-medium text-sm transition ${
          status === "ACCEPTED"
            ? "bg-green-600 text-white hover:bg-green-700"
            : status === "DECLINED"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {status === "PENDING" && "RSVP"}
        {status === "ACCEPTED" && "✔ Attending"}
        {status === "DECLINED" && "❌ Not Attending"}
      </button>
    </div>
  );
}
