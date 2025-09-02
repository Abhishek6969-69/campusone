"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Home,
  BookOpen,
  FileText,
  Utensils,
  Calendar,
  Code,
  User,
} from "lucide-react";

const navItems = [
  { href: "/student", label: "Dashboard", icon: Home },
  { href: "/attendance", label: "Attendance", icon: BookOpen },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/canteen", label: "Canteen", icon: Utensils },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/coding", label: "Coding", icon: Code },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger button (always visible) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} className="text-gray-700 dark:text-gray-200" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-gray-900 dark:bg-gray-950 text-white p-6 transition-transform duration-300 z-40 shadow-lg",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="mb-6 p-2 bg-gray-800 dark:bg-gray-700 rounded hover:bg-gray-700 dark:hover:bg-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-6 text-white dark:text-gray-200">
          CampusOne
        </h2>

        <nav className="space-y-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-gray-800 dark:bg-gray-700 text-blue-400 font-semibold"
                    : "text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
