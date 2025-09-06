import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE = {
  attendance: "http://localhost:4001", // attendance service
  notes: "http://localhost:4002",      // notes service
  events: "http://localhost:4003",     // events service
};

// Create an axios instance with default config
const baseClient = axios.create({
  withCredentials: true,
  timeout: 10000,
});

// Create authenticated request handler
const withAuth = async () => {
  const session = await getSession();
  
  console.log('API Client - Current session:', session);
  
  if (!session) {
    console.error('No active session found');
    throw new Error("No active session");
  }
  
  // Check all possible token locations
  const token = (session as any)?.accessToken || 
                (session as any)?.token || 
                session.user?.accessToken;
                
  console.log('API Client - Found token:', !!token);
  
  if (!token) {
    console.error('No access token found in session:', {
      sessionToken: (session as any)?.accessToken,
      rootToken: (session as any)?.token,
      userToken: session.user?.accessToken
    });
    throw new Error("No access token available");
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ✅ Get Student Attendance
export async function getStudentAttendance(studentId: string) {
  const config = await withAuth();
  const res = await baseClient.get(`${API_BASE.attendance}/attendance/student/${studentId}`, config);

  const data = res.data;
  return Array.isArray(data) ? data : [];
}

// ✅ Get Events
export async function getEvents() {
  const config = await withAuth();
  const res = await baseClient.get(`${API_BASE.events}/events`, config);
  const data = res.data;
  return Array.isArray(data) ? data : [];
}

// ✅ Get Notes
export async function getNotes() {
  const config = await withAuth();
  const res = await baseClient.get(`${API_BASE.notes}/notes`, config);
  const data = res.data;
  return Array.isArray(data) ? data : [];
}
