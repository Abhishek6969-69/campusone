"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Edit, Save, X } from "lucide-react";
import Sidebar from "../components/sidebar";
import DarkModeToggle from "../components/DarkModeToggle";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  interface FormData {
    name: string;
    email: string;
    rollNo: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    semester: string;
    branch: string;
  }

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    rollNo: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    semester: "",
    branch: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signup");
      return;
    }

    // Initialize form with session data
    setFormData({
      name: session.user?.name || "",
      email: session.user?.email || "",
      rollNo: session.user?.rollNo || "",
      phone: "", // Will be loaded from API
      address: "",
      dateOfBirth: "",
      semester: "",
      branch: "",
    });

    // Load complete user profile
    loadUserProfile();
  }, [session, status, router]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const userData = await response.json();
        // Handle date format
        const formattedDate = (() => {
          if (!userData.dateOfBirth) return "" as const;
          try {
            const date = new Date(userData.dateOfBirth);
            return date.toISOString().split('T')[0];
          } catch (e) {
            console.error('Error formatting date:', e);
            return "" as const;
          }
        })();
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          rollNo: userData.rollNo || "",
          phone: userData.phone || "",
          address: userData.address || "",
          dateOfBirth: formattedDate ?? "",
          semester: userData.semester?.toString() || "",
          branch: userData.branch || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Format data before sending
      const updateData = {
        name: formData.name || null,
        rollNo: formData.rollNo || null,
        phone: formData.phone || null,
        address: formData.address || null,
        branch: formData.branch || null,
        semester: formData.semester ? parseInt(formData.semester) : null,
        dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00.000Z` : null
      };

      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        // Update session data
        await update();
        // Reload profile data
        await loadUserProfile();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update profile");
      }
    } catch (error) {
      alert("An error occurred while updating profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordSection(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to change password");
      }
    } catch (error) {
      alert("An error occurred while changing password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    loadUserProfile(); // Reload original data
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
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Sidebar />

      <main className="flex-1 p-8 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8 transition-colors">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&size=96&background=3b82f6&color=ffffff`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{formData.name || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                  <span className="text-xs text-gray-500">Email cannot be changed</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{formData.phone || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : "Not set"}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Academic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Roll Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{formData.rollNo || "Not set"}</p>
                  )}
                </div>

                {session.user.role === "STUDENT" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Semester</label>
                      {isEditing ? (
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                        >
                          <option value="">Select Semester</option>
                          {[1,2,3,4,5,6,7,8].map(sem => (
                            <option key={sem} value={sem}>{sem}st Semester</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {formData.semester ? `${formData.semester}${formData.semester === "1" ? "st" : formData.semester === "2" ? "nd" : formData.semester === "3" ? "rd" : "th"} Semester` : "Not set"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Branch/Department</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          placeholder="e.g., Computer Science"
                          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">{formData.branch || "Not set"}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">College</label>
                  <p className="text-gray-600 dark:text-gray-400">{session.user.collegeName}</p>
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{formData.address || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8 transition-colors">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
            <h2 className="text-xl font-semibold">Password & Security</h2>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {showPasswordSection ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordSection && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg p-2 pr-10 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg p-2 pr-10 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg p-2 pr-10 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors">
          <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <DarkModeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
