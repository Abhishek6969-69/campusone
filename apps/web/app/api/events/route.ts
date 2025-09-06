import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";

const EVENTS_API = "http://localhost:4003";

// Get events
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = (session as any).accessToken;
    const response = await axios.get(`${EVENTS_API}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// Create event
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "PROFESSOR" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Parse the date string into a Date object
    if (body.date) {
      body.date = new Date(body.date);
    }
    
    console.log('Events API - Session:', session);
    
    // Try to get token from all possible locations
    const token = (session as any).accessToken || 
                 (session as any).token || 
                 session.user?.accessToken;

    if (!token) {
      console.error("No access token found in session:", {
        sessionToken: (session as any).accessToken,
        rootToken: (session as any).token,
        userToken: session.user?.accessToken
      });
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    console.log('Events API - Using token:', token);

    const response = await axios.post(`${EVENTS_API}/events`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { 
        error: "Failed to create event", 
        details: error.message,
        response: error.response?.data 
      },
      { status: 500 }
    );
  }
}
