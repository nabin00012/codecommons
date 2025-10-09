import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

// Get single assignment with submissions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const { id, assignmentId } = params;
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { db } = await connectToDatabase();
    
    // Get assignment
    const assignment = await db.collection("assignments").findOne({ 
      _id: new ObjectId(assignmentId),
      classroomId: id 
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Get user info
    const user = await db.collection("users").findOne({ email: decoded.email });
    const isTeacher = user?.role === "teacher";

    // Get submissions
    let submissions = [];
    if (isTeacher) {
      // Teachers see all submissions
      submissions = await db.collection("submissions")
        .find({ assignmentId: assignmentId })
        .toArray();
      
      // Fetch all student info in one query (batch fetch)
      if (submissions.length > 0) {
        const studentIds = submissions.map(s => new ObjectId(s.studentId));
        const students = await db.collection("users")
          .find({ _id: { $in: studentIds } })
          .toArray();
        
        // Create a map for quick lookup
        const studentMap = new Map(
          students.map(s => [s._id.toString(), s])
        );
        
        // Enrich submissions with student info
        submissions = submissions.map(submission => ({
          ...submission,
          studentName: studentMap.get(submission.studentId)?.name || "Unknown",
          studentEmail: studentMap.get(submission.studentId)?.email || "",
        }));
      }
    } else {
      // Students see only their own submission
      submissions = await db.collection("submissions")
        .find({ 
          assignmentId: assignmentId,
          studentId: user?._id.toString()
        })
        .toArray();
    }

    return NextResponse.json({
      success: true,
      data: {
        assignment: {
          _id: assignment._id.toString(),
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          points: assignment.points,
          attachments: assignment.attachments || [],
        },
        submissions: submissions.map((s: any) => ({
          _id: s._id.toString(),
          studentId: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail,
          submittedAt: s.submittedAt,
          content: s.content,
          attachments: s.attachments || [],
          grade: s.grade,
          feedback: s.feedback,
        })),
        isTeacher,
      },
    });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 }
    );
  }
}
