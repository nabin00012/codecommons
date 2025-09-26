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

    const { db } = await connectToDatabase();

    // Auto-provision admin if it's admin email
    if (email === "admin@jainuniversity.ac.in") {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await db.collection("users").updateOne(
        { email: "admin@jainuniversity.ac.in" },
        {
          $set: {
            email: "admin@jainuniversity.ac.in",
            password: hashedPassword,
            name: "Jain University Admin",
            role: "admin",
            department: "administration",
            onboardingCompleted: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        },
        { upsert: true }
      );
    }

    const user = await db.collection("users").findOne({ email });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: {
        ...userWithoutPassword,
        id: user._id.toString(),
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
