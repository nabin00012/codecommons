import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// Grade a submission
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; submissionId: string } }
) {
  try {
    const { id, submissionId } = params;
    console.log("Grading submission:", submissionId);

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

    // Verify user is a teacher
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user || user.role !== "teacher") {
      return NextResponse.json(
        { error: "Only teachers can grade assignments" },
        { status: 403 }
      );
    }

    const { grade, feedback } = await request.json();

    // Validate grade
    if (grade === undefined || grade === null) {
      return NextResponse.json({ error: "Grade is required" }, { status: 400 });
    }

    // Update the submission
    const result = await db.collection("submissions").updateOne(
      { _id: new ObjectId(submissionId) },
      {
        $set: {
          grade: Number(grade),
          feedback: feedback || "",
          status: "graded",
          gradedAt: new Date(),
          gradedBy: decoded.email,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Get updated submission
    const submission = await db
      .collection("submissions")
      .findOne({ _id: new ObjectId(submissionId) });

    return NextResponse.json({
      success: true,
      data: {
        _id: submission?._id.toString(),
        grade: submission?.grade,
        feedback: submission?.feedback,
        status: submission?.status,
        gradedAt: submission?.gradedAt,
      },
    });
  } catch (error) {
    console.error("Error grading submission:", error);
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    );
  }
}
