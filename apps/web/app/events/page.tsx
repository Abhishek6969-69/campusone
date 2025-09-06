"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api";
import EventCard from "../components/EventCard";

const tabs = ["All", "Upcoming", "Past"];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("All");

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const today = new Date();

  const filteredEvents = events.filter((event: any) => {
    const eventDate = new Date(event.date);

    if (activeTab === "Upcoming") return eventDate > today;
    if (activeTab === "Past") return eventDate < today;
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
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl shadow bg-white dark:bg-gray-800 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">No events found.</p>
        )}
      </div>
    </div>
  );
}
