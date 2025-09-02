import axios from "axios";

const API_BASE = {
  attendance: "http://localhost:4001", // attendance service
  notes: "http://localhost:4002",      // notes service
  events: "http://localhost:4003",     // events service
};

// ✅ Get Student Attendance
export async function getStudentAttendance(studentId: string) {
  const res = await axios.get(`${API_BASE.attendance}/attendance/student/${studentId}`, {
    withCredentials: true,
  });

  const data = res.data;
  return Array.isArray(data) ? data : [];
}

// ✅ Get Events
export async function getEvents() {
  const res = await axios.get(`${API_BASE.events}/events`, {
    withCredentials: true,
  });

  const data = res.data;
  return Array.isArray(data) ? data : [];
}

// ✅ Get Notes
export async function getNotes() {
  const res = await axios.get(`${API_BASE.notes}/notes`, {
    withCredentials: true,
  });

  const data = res.data;
  return Array.isArray(data) ? data : [];
}
