"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import colleges from "../../lib/colleges"; // ✅ import colleges from local file

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add state for name
  const [name, setName] = useState("");
  // Add state for email
  const [email, setEmail] = useState("");
  // Add state for password
  const [password, setPassword] = useState("");
  // Add state for confirmPassword
  const [confirmPassword, setConfirmPassword] = useState("");
  // Add state for role
  const [role, setRole] = useState("STUDENT");

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
  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setQuery("");
    setSelectedCollege("");
    setSelectedCollegeId("");
    setShowDropdown(false);
  };

  const handleSelectCollege = (collegeName: string, collegeId: string) => {
    setSelectedCollege(collegeName);
    setSelectedCollegeId(collegeId);
    setQuery(collegeName);
    setShowDropdown(false);
  };

const handleSignup = async () => {
  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        collegeId: selectedCollegeId, // must be an ID, not just name
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Signup failed");
    } else {
      alert("Account created successfully! Please sign in to continue.");
      // Clear the form and switch to signin
      clearForm();
      setIsSignIn(true);
    }
  } catch (error) {
    alert("An error occurred during signup");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleSignin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Invalid credentials");
    } else {
      // Successful signin - check if user needs to complete profile
      // For now, redirect to profile setup, they can skip if not needed
      router.push("/setup-profile");
    }
  } catch (error) {
    alert("An error occurred during signin");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Left Side with Logo */}
      <div className="hidden md:flex w-1/2 bg-blue-50 dark:bg-gray-800 items-center justify-center transition-colors">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-6">
            CAMPUS OS
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            The Operating System for University Life
          </p>
          <Image
            src="/img.png"
            alt="Campus Logo"
            width={280}
            height={280}
            priority
            className="mx-auto my-10"
          />
        </div>
      </div>

      {/* Right Side Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950 transition-colors">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white dark:bg-gray-900">
          {/* Toggle Sign In / Sign Up */}
          <div className="flex justify-center space-x-10 mb-8">
            <button
              className={`pb-2 text-lg font-semibold transition ${
                isSignIn
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              }`}
              onClick={() => {
                setIsSignIn(true);
                clearForm();
              }}
            >
              Sign In
            </button>
            <button
              className={`pb-2 text-lg font-semibold transition ${
                !isSignIn
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              }`}
              onClick={() => {
                setIsSignIn(false);
                clearForm();
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {isSignIn ? (
            <form onSubmit={handleSignin} className="space-y-5">
              <input
                type="email"
                placeholder="Email or Student ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="h-4 w-4" />
                  <span>Remember me</span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* OAuth Options */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="mx-2 text-gray-400 text-sm">or</span>
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white"
                >
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white"
                >
                  <Image
                    src="/github.svg"
                    alt="Github"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Github
                </button>
              </div>
            </form>
          ) : (
            // Sign Up Form
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
              />

              {/* College Searchable Dropdown and Passwords */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or select your college..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedCollege("");
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
                  />
                  {showDropdown && (
                    <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg mt-1 max-h-40 overflow-y-auto w-full shadow">
                      {filteredColleges.length === 0 ? (
                        <li className="p-2 text-gray-500 dark:text-gray-300">
                          No colleges found
                        </li>
                      ) : (
                        filteredColleges.map((college: any, index: number) => (
                          <li
                            key={index}
                            onClick={() => handleSelectCollege(college.name, college.id)}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                          >
                            {college.name} ({college.city})
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="PROFESSOR">Professor</option>
                </select>
              </div>
              <button 
                type="button"
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-semibold transition">
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
