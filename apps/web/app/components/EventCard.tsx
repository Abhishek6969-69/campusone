"use client";

import { useState } from "react";

type RSVPStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export default function EventCard({
  title,
  date,
  club,
}: {
  title: string;
  date: string;
  club: string;
}) {
  const [status, setStatus] = useState<RSVPStatus>("PENDING");

  const handleRSVP = () => {
    if (status === "PENDING") setStatus("ACCEPTED");
    else if (status === "ACCEPTED") setStatus("DECLINED");
    else setStatus("PENDING");
  };

  return (
    <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-800 transition hover:shadow-lg cursor-pointer">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{club}</p>

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
        {status === "ACCEPTED" && "✔ Accepted"}
        {status === "DECLINED" && "❌ Declined"}
      </button>
    </div>
  );
}
