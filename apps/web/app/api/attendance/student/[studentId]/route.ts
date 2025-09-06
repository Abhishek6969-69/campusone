import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import axios from "axios";

const ATTENDANCE_API = "http://localhost:4001";

// Get student's attendance
export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Students can only view their own attendance
  if (
    session.user.role === "STUDENT" &&
    session.user.id !== params.studentId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const accessToken = (session as any).accessToken;
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    
    const endpoint = classId 
      ? `${ATTENDANCE_API}/attendance/student/${params.studentId}/${classId}/percentage`
      : `${ATTENDANCE_API}/attendance/student/${params.studentId}`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching student attendance:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch student attendance",
        details: error.message,
        response: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}
