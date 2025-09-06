import { NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    console.log("🚀 Signup API called");
    const body = await req.json();
    console.log("📝 Request body:", body);
    
    const { name, email, password, role, collegeId } = body;

    if (!name || !email || !password || !role || !collegeId) {
      console.log("❌ Missing required fields:", { name: !!name, email: !!email, password: !!password, role: !!role, collegeId: !!collegeId });
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    console.log("🔍 Checking for existing user with email:", email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("❌ User already exists:", existingUser.id);
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("👤 Creating new user...");
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        collegeId,
      },
    });

    console.log("✅ User created successfully:", newUser.id);
    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("💥 Signup error:", err);
    if (err instanceof Error) {
      console.error("💥 Error message:", err.message);
      console.error("💥 Error stack:", err.stack);
    }
    return NextResponse.json({ error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
