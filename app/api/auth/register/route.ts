import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email domain for students
    if (role === "student" && !email.endsWith("@jainuniversity.ac.in")) {
      return NextResponse.json(
        { error: "Student accounts must use @jainuniversity.ac.in email" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      department: "",
      section: "",
      year: "",
      specialization: "",
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...userWithoutPassword,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
