"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function ProfileSetup() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [rollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/signup"); // Not authenticated, redirect to signup
      return;
    }
  }, [session, status, router]);

  const handleUpdateProfile = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        rollNo,
        phone,
        address,
        dateOfBirth,
        semester,
        branch,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update profile");
      } else {
        alert("Profile updated successfully!");
        // Redirect to appropriate dashboard based on role
        if (session?.user?.role === "STUDENT") {
          router.push("/student");
        } else if (session?.user?.role === "PROFESSOR") {
          router.push("/professor");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      alert("An error occurred while updating profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Redirect to appropriate dashboard based on role
    if (session?.user?.role === "STUDENT") {
      router.push("/student");
    } else if (session?.user?.role === "PROFESSOR") {
      router.push("/professor");
    } else {
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/img.png"
                alt="Campus Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome to Campus OS!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your profile to get started
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{session.user?.name}</strong> • {session.user?.email} • {session.user?.collegeName}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Roll Number / Employee ID"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                />
                {session.user?.role === "STUDENT" && (
                  <>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                      <option value="3">3rd Semester</option>
                      <option value="4">4th Semester</option>
                      <option value="5">5th Semester</option>
                      <option value="6">6th Semester</option>
                      <option value="7">7th Semester</option>
                      <option value="8">8th Semester</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Branch/Department (e.g., Computer Science)"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                />
                <textarea
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            {/* Password Update (Optional) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Update Password (Optional)
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {newPassword && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Updating..." : "Complete Profile"}
              </button>
              <button
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg font-semibold transition"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
