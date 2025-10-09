import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// Get all submissions for the current student in a classroom
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { db } = await connectToDatabase();
    
    // Get user
    const user = await db.collection("users").findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get all assignments for this classroom
    const assignments = await db.collection("assignments").find({
      classroomId: id
    }).toArray();

    const assignmentIds = assignments.map(a => a._id.toString());

    // Get all submissions by this student for these assignments
    const submissions = await db.collection("submissions").find({
      studentId: user._id.toString(),
      assignmentId: { $in: assignmentIds }
    }).toArray();

    const formattedSubmissions = submissions.map(sub => ({
      _id: sub._id.toString(),
      assignmentId: sub.assignmentId,
      studentId: sub.studentId,
      content: sub.content,
      submittedAt: sub.submittedAt,
      grade: sub.grade,
      feedback: sub.feedback,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSubmissions,
    });
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
