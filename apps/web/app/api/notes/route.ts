import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";

const NOTES_API = "http://localhost:4002";

// Get notes
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = (session as any).accessToken;
    const response = await axios.get(`${NOTES_API}/notes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// Create note
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
    
    const response = await axios.post(`${NOTES_API}/notes`, body, {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
