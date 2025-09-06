"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EventForm({ onClose, onSuccess }: Props) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('EventForm - Current session:', session);

    try {
      if (!session?.user) {
        throw new Error("Not authenticated");
      }

      // First, try to refresh the session to ensure we have a valid token
      const res = await fetch("/api/auth/session");
      const updatedSession = await res.json();
      console.log('EventForm - Refreshed session:', updatedSession);

      // Now submit the event
      const eventRes = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          professorId: session.user.id,
          collegeId: session.user.collegeId
        }),
      });

      if (!eventRes.ok) {
        const error = await eventRes.json().catch(() => ({}));
        console.error('Event creation failed:', error);
        throw new Error(error.error || "Failed to create event");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Date
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
