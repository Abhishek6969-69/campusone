"use client";

import { useState } from "react";
import EventCard from "../components/EventCard";

const eventsData = [
  { title: "Art Exhibition", date: "2024-04-25", club: "Art Society" },
  { title: "Tech Symposium", date: "2024-04-28", club: "Computer Science Club" },
  { title: "Music Concert", date: "2024-05-05", club: "Music Club" },
  { title: "Environmental Awareness Drive", date: "2024-05-12", club: "Eco Club" },
];

const tabs = ["All", "Upcoming", "Past", "By Club"];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const today = new Date();

  const filteredEvents = eventsData.filter((event) => {
    const eventDate = new Date(event.date);

    if (activeTab === "Upcoming") return eventDate > today;
    if (activeTab === "Past") return eventDate < today;
    if (activeTab === "By Club") return event.club === "Music Club"; // demo filter
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📅 Events</h1>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, i) => (
            <EventCard key={i} {...event} />
          ))
        ) : (
          <p className="text-gray-500">No events found.</p>
        )}
      </div>
    </div>
  );
}
