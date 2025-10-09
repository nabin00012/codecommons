import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

// Submit assignment
export async function POST(
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
    
    // Get user
    const user = await db.collection("users").findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content, attachments } = body;

    // Check if already submitted
    const existingSubmission = await db.collection("submissions").findOne({
      assignmentId: assignmentId,
      studentId: user._id.toString(),
    });

    if (existingSubmission) {
      // Update existing submission
      await db.collection("submissions").updateOne(
        { _id: existingSubmission._id },
        {
          $set: {
            content,
            attachments: attachments || [],
            submittedAt: new Date(),
            updatedAt: new Date(),
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: "Assignment resubmitted successfully",
      });
    } else {
      // Create new submission
      const submission = {
        assignmentId: assignmentId,
        studentId: user._id.toString(),
        content,
        attachments: attachments || [],
        submittedAt: new Date(),
        grade: null,
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("submissions").insertOne(submission);

      return NextResponse.json({
        success: true,
        message: "Assignment submitted successfully",
      });
    }
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
