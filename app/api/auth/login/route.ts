import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log("Login request received");
    const body = await request.json();
    console.log("Login body:", body);

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Attempting database connection...");
    const { db } = await connectToDatabase();
    console.log("Database connected successfully");

    // Note: Admin user should be created manually or through registration
    // Auto-provisioning removed to allow password changes to persist

    console.log("Looking up user:", email);
    const user = await db.collection("users").findOne({ email });
    console.log("User found:", !!user);
    console.log("User has password:", !!user?.password);

    if (!user || !user.password) {
      console.log("User lookup failed - no user or no password");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Comparing passwords...");
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValid);

    if (!isValid) {
      console.log("Password comparison failed");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    console.log("Creating JWT token...");
    console.log("User ID:", user._id.toString());
    console.log("JWT Secret exists:", !!process.env.NEXTAUTH_SECRET);

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );
    console.log("JWT token created successfully");

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: {
        ...userWithoutPassword,
        id: user._id.toString(),
        _id: user._id.toString(),
        profileCompleted: user.profileCompleted || false,
        phone: user.phone || null,
        usn: user.usn || null,
        studentId: user.studentId || null,
        collegeId: user.collegeId || null,
        department: user.department || null,
      },
      token,
    });

    // Set token as cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
