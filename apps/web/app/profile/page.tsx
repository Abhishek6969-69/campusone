"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import DarkModeToggle from "../components/DarkModeToggle";

export default function ProfileSetup() {
  const router = useRouter();
  const [form] = useState({
    rollNo: "123456",
    email: "abhishek@example.com",
    phone: "123-456-7490",
    address: "123 Main St, City, State",
  });

  async function handleSave() {
    router.push("/dashboard/student");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Sidebar />

      <main className="flex-1 p-8 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8 transition-colors">
          <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
            Profile
          </h2>
          <div className="flex items-center gap-6">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Abhishek Yadav</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Roll No: {form.rollNo}
              </p>
              <p className="text-gray-600 dark:text-gray-400">📧 {form.email}</p>
              <p className="text-gray-600 dark:text-gray-400">📞 {form.phone}</p>
              <p className="text-gray-600 dark:text-gray-400">🏠 {form.address}</p>
            </div>
            <button className="ml-auto border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors">
          <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
            Settings
          </h2>

          <div className="mb-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
            >
              Change Password
            </button>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="mt-8">
            <h3 className="font-semibold mb-3">Appearance</h3>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
