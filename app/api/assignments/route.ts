import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

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

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    ) as any;

    const { db } = await connectToDatabase();

    // Get assignments for user's classrooms
    const assignments = await db.collection("assignments").find({}).toArray();

    // Get all submissions for the current user to check submission status
    const submissions = await db
      .collection("submissions")
      .find({
        studentEmail: decoded.email,
      })
      .toArray();

    // Create a map of assignmentId -> submission for quick lookup
    const submissionMap = new Map(
      submissions.map((sub) => [sub.assignmentId, sub])
    );

    // Get classroom names
    const classroomIds = [...new Set(assignments.map((a) => a.classroomId))];
    const classrooms = await db
      .collection("classrooms")
      .find({
        _id: { $in: classroomIds.map((id) => new ObjectId(id)) },
      })
      .toArray();
    const classroomMap = new Map(
      classrooms.map((c) => [c._id.toString(), c.name])
    );

    const formattedAssignments = assignments.map((assignment) => {
      const assignmentId = assignment._id.toString();
      const submission = submissionMap.get(assignmentId);

      return {
        _id: assignmentId,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        points: assignment.points || 100,
        classroomId: assignment.classroomId,
        classroomName: classroomMap.get(assignment.classroomId) || "Unknown",
        createdBy: assignment.createdBy,
        submissionStatus: submission
          ? submission.status === "graded"
            ? "graded"
            : "submitted"
          : "pending",
        grade: submission?.grade,
        submittedAt: submission?.submittedAt,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      };
    });

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
