import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";

const ATTENDANCE_API = "http://localhost:4001";

// Get all classes for the authenticated user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the access token from the session
    const accessToken = session.accessToken;

    if (!accessToken) {
      console.error("No access token found in session:", session);
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    if (!session.user?.role) {
      console.error("No role found in session:", session);
      return NextResponse.json({ error: "User role not found" }, { status: 400 });
    }

    // Get classes based on user role
    const endpoint = session.user.role === "PROFESSOR"
      ? `${ATTENDANCE_API}/classes/teaching`
      : `${ATTENDANCE_API}/classes/enrolled`;

    console.log(`Fetching classes from endpoint: ${endpoint}`);
    
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log detailed error information
    console.error("Error fetching classes:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: "Could not connect to attendance service",
          details: "The attendance service appears to be offline"
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to fetch classes",
        details: error.message,
        response: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}
