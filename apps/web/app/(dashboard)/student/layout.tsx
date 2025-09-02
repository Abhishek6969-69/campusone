"use client";

import Sidebar from "../../components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
        {children}
      </main>
    </div>
  );
}
