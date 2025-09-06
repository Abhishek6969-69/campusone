// app/api/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const schema = z.object({
  // only what your form actually edits here
  name: z.string().trim().min(1).max(100).optional(),
  rollNo: z.string().trim().max(50).nullable().optional(),
  phone: z.string().trim().max(20).nullable().optional(),
  address: z.string().trim().max(500).nullable().optional(),
  branch: z.string().trim().max(100).nullable().optional(),
  // allow number or string -> number; or null to clear
  semester: z
    .union([z.number().int().min(1).max(8), z.string().regex(/^\d+$/), z.null()])
    .optional(),
  // ISO date string "YYYY-MM-DD" or full ISO, or null to clear
  dateOfBirth: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
      z.string().datetime().optional(),                    // Full ISO format
      z.null(),                                           // Allow clearing the date
    ])
    .refine(val => {
      if (!val) return true; // null or undefined is OK
      const date = new Date(val);
      return !isNaN(date.getTime()); // validate it parses to a valid date
    }, "Invalid date format")
    .optional(),
  // DO NOT update password here; use /api/change-password
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await request.json();
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      rollNo,
      phone,
      address,
      branch,
      semester,
      dateOfBirth,
    } = parsed.data;

    // Normalize types
    const sem =
      semester === null
        ? null
        : typeof semester === "string"
        ? Number(semester)
        : semester; // number
    if (sem !== undefined && sem !== null && (isNaN(sem) || sem < 1 || sem > 8)) {
      return NextResponse.json({ error: "Semester must be 1-8" }, { status: 400 });
    }

    // Handle date of birth with better validation and error handling
    let dob: Date | null | undefined = undefined;
    if (dateOfBirth === null) {
      dob = null;
    } else if (typeof dateOfBirth === "string") {
      try {
        // Handle YYYY-MM-DD format by appending time at UTC midnight
        if (dateOfBirth.length === 10) {
          dob = new Date(`${dateOfBirth}T00:00:00.000Z`);
        } else {
          // Handle full ISO string
          dob = new Date(dateOfBirth);
        }
        // Validate the parsed date
        if (isNaN(dob.getTime())) {
          return NextResponse.json({ error: "Invalid date format for date of birth" }, { status: 400 });
        }
      } catch (e) {
        return NextResponse.json({ error: "Invalid date format for date of birth" }, { status: 400 });
      }
    }

    // Build update object (allow clearing to null)
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (rollNo !== undefined) data.rollNo = rollNo;       // can be string or null
    if (phone !== undefined) data.phone = phone;          // string or null
    if (address !== undefined) data.address = address;    // string or null
    if (branch !== undefined) data.branch = branch;       // string or null
    if (sem !== undefined) data.semester = sem;           // number or null
    if (dob !== undefined) data.dateOfBirth = dob;        // Date or null

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email }, // <- email is reliable
      data,
      include: {
        college: { select: { name: true, city: true } },
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        rollNo: updatedUser.rollNo,
        phone: updatedUser.phone,
        address: updatedUser.address,
        dateOfBirth: updatedUser.dateOfBirth,
        semester: updatedUser.semester,
        branch: updatedUser.branch,
        role: updatedUser.role,
        college: updatedUser.college,
      },
    });
  } catch (error: any) {
    console.error("💥 Update profile error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This roll number is already taken", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
