import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { phone, usn, studentId, collegeId, department } = await request.json();

    // Validate required fields
    if (!phone || !usn || !collegeId || !department) {
      return NextResponse.json(
        { error: "Phone, USN, College ID, and Department are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if USN is already taken by another user
    const existingUSN = await db.collection("users").findOne({
      usn: usn,
      email: { $ne: decoded.email }
    });

    if (existingUSN) {
      return NextResponse.json(
        { error: "This USN is already registered with another account" },
        { status: 400 }
      );
    }

    // Update user profile
    const result = await db.collection("users").updateOne(
      { email: decoded.email },
      {
        $set: {
          phone,
          usn: usn.toUpperCase(),
          studentId: studentId || null,
          collegeId,
          department,
          profileCompleted: true,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get updated user
    const updatedUser = await db.collection("users").findOne({ email: decoded.email });

    return NextResponse.json({
      success: true,
      message: "Profile completed successfully",
      user: {
        id: updatedUser?._id.toString(),
        _id: updatedUser?._id.toString(),
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
        department: updatedUser?.department,
        phone: updatedUser?.phone,
        usn: updatedUser?.usn,
        studentId: updatedUser?.studentId,
        collegeId: updatedUser?.collegeId,
        profileCompleted: updatedUser?.profileCompleted,
      },
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { error: "Failed to complete profile" },
      { status: 500 }
    );
  }
}
