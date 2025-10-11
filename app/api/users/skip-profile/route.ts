import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    ) as any;
    const { db } = await connectToDatabase();

    // Update user profile - mark as completed without required fields
    const result = await db.collection("users").updateOne(
      { email: decoded.email },
      {
        $set: {
          profileCompleted: true,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get updated user
    const updatedUser = await db
      .collection("users")
      .findOne({ email: decoded.email });

    return NextResponse.json({
      success: true,
      message: "Profile setup skipped",
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
        profileImage: updatedUser?.profileImage,
        avatar: updatedUser?.avatar || updatedUser?.profileImage,
      },
    });
  } catch (error) {
    console.error("Error skipping profile:", error);
    return NextResponse.json(
      { error: "Failed to skip profile" },
      { status: 500 }
    );
  }
}
