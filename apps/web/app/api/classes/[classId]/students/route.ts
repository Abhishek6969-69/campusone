import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import axios from "axios";

const ATTENDANCE_API = "http://localhost:4001";

// Get students in a class
export async function GET(
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
    const accessToken = (session as any).accessToken;
    const response = await axios.get(
      `${ATTENDANCE_API}/class/${params.classId}/students`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching class students:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch class students",
        details: error.message,
        response: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}
