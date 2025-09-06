import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

const ATTENDANCE_API = "http://localhost:4001";

// Get class attendance summary
export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = (session as any).accessToken;
    const response = await axios.get(
      `${ATTENDANCE_API}/attendance/class/${params.classId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching class attendance:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch class attendance",
        details: error.message,
        response: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Submit bulk attendance
export async function POST(
  request: Request,
  { params }: { params: { classId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "PROFESSOR" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const accessToken = (session as any).accessToken;

    const response = await axios.post(
      `${ATTENDANCE_API}/attendance/class/${params.classId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error submitting attendance:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit attendance",
        details: error.message,
        response: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}
