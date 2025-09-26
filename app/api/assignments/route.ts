import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// Get all assignments for current user
export async function GET(request: NextRequest) {
  try {
    console.log("Fetching assignments for user...");
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;

    const { db } = await connectToDatabase();
    
    // Get assignments for user's classrooms
    const assignments = await db.collection("assignments").find({}).toArray();

    const formattedAssignments = assignments.map(assignment => ({
      _id: assignment._id.toString(),
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points || 100,
      classroomId: assignment.classroomId,
      createdBy: assignment.createdBy,
      status: "pending", // Default status
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
