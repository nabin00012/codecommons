import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log("Registration request received");
    const body = await request.json();
    console.log("Request body:", body);
    
    const { name, email, password, role } = body;

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

    console.log("Connecting to database...");
    const { db } = await connectToDatabase();
    console.log("Database connected successfully");

    // Check if user already exists
    console.log("Checking if user exists:", email);
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully");

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
      profileCompleted: false,
      phone: null,
      usn: null,
      studentId: null,
      collegeId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Creating user in database...");
    const result = await db.collection("users").insertOne(newUser);
    console.log("User created with ID:", result.insertedId);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...userWithoutPassword,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error details:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    
    return NextResponse.json(
      { 
        error: "Registration failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
