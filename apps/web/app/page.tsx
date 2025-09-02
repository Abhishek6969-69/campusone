"use client";

import { useState, useMemo } from "react";
import {colleges} from "@campusone/db"; // client-safe import (your JSON)

export default function HomePage() {
  const [selectedCollege, setSelectedCollege] = useState("");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Filter colleges dynamically
  const filteredColleges = useMemo(() => {
    if (!query.trim()) return colleges;
    return colleges.filter(
      (college: any) =>
        college.name?.toLowerCase().includes(query.toLowerCase()) ||
        college.city?.toLowerCase().includes(query.toLowerCase()) ||
        college.state?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSelect = (collegeName: string) => {
    setSelectedCollege(collegeName);
    setQuery(collegeName); // fill the search box with selected college
    setShowDropdown(false); // ✅ close dropdown
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Welcome to CampusOne
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Your Digital Campus Home
        </p>

        {/* 🔍 Searchable Select */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search or select your college..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedCollege(""); // reset selection when typing
              setShowDropdown(true); // open dropdown when typing
            }}
            onFocus={() => setShowDropdown(true)} // reopen if input focused
            className="w-full p-3 border rounded-lg text-gray-800 dark:text-white dark:bg-gray-800"
          />
          {showDropdown && query && (
            <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg mt-1 max-h-48 overflow-y-auto w-full shadow-lg">
              {filteredColleges.length === 0 ? (
                <li className="p-2 text-gray-500">No colleges found</li>
              ) : (
                filteredColleges.map((college: any, index: number) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(college.name)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {college.name} ({college.city})
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Signup Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow"
            disabled={!selectedCollege}
          >
            Sign Up as a Student
          </button>
          <button
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg shadow"
            disabled={!selectedCollege}
          >
            Sign Up as a Professor
          </button>
        </div>

        {/* Sign In */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
