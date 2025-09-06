"use client";

import { useSession } from "next-auth/react";

export default function ProfileSetupDebug() {
  const { data: session, status } = useSession();

  console.log("Session status:", status);
  console.log("Session data:", session);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading session...</p>
          <p className="mt-2 text-sm text-gray-500">Status: {status}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Not Authenticated</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Status: {status}</p>
          <a 
            href="/signup" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Signup
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Profile Setup - Debug Mode
          </h1>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Session Debug Info:</h3>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Role:</strong> {session.user?.role}</p>
            <p><strong>College:</strong> {session.user?.collegeName}</p>
            <p><strong>Roll No:</strong> {session.user?.rollNo || "Not set"}</p>
          </div>

          <div className="space-y-4">
            <a 
              href="/student" 
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
            >
              Go to Student Dashboard
            </a>
            <a 
              href="/signup" 
              className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-300"
            >
              Back to Signup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
