import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// Get submissions for an assignment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Fetching submissions for assignment:", id);

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Get submissions for this assignment
    const submissions = await db
      .collection("submissions")
      .find({
        assignmentId: id,
      })
      .toArray();

    const formattedSubmissions = submissions.map((submission) => ({
      _id: submission._id.toString(),
      assignmentId: submission.assignmentId,
      studentEmail: submission.studentEmail,
      studentName: submission.studentName,
      content: submission.content,
      fileUrl: submission.fileUrl,
      fileName: submission.fileName,
      submittedAt: submission.submittedAt,
      grade: submission.grade,
      feedback: submission.feedback,
      status: submission.status || "submitted",
    }));

    return NextResponse.json({
      success: true,
      data: formattedSubmissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// Submit assignment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Submitting assignment:", id);

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

    const formData = await request.formData();
    const content = formData.get("content") as string;
    const file = formData.get("file") as File;

    const { db } = await connectToDatabase();

    // Get user info
    const user = await db.collection("users").findOne({ email: decoded.email });

    // Check if already submitted
    const existingSubmission = await db.collection("submissions").findOne({
      assignmentId: id,
      studentEmail: decoded.email,
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Assignment already submitted" },
        { status: 400 }
      );
    }

    let submissionData: any = {
      assignmentId: id,
      studentEmail: decoded.email,
      studentName: user?.name || "Unknown Student",
      content: content || "",
      submittedAt: new Date(),
      status: "submitted",
      grade: null,
      feedback: "",
    };

    if (file && file.size > 0) {
      // Handle file submission
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      submissionData = {
        ...submissionData,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileContent: buffer.toString("base64"),
        fileUrl: `/api/assignments/${id}/submissions/download/${encodeURIComponent(
          file.name
        )}`,
      };
    }

    const result = await db.collection("submissions").insertOne(submissionData);

    const formattedSubmission = {
      _id: result.insertedId.toString(),
      assignmentId: submissionData.assignmentId,
      studentEmail: submissionData.studentEmail,
      studentName: submissionData.studentName,
      content: submissionData.content,
      fileName: submissionData.fileName,
      fileUrl: submissionData.fileUrl,
      submittedAt: submissionData.submittedAt,
      status: submissionData.status,
    };

    return NextResponse.json({
      success: true,
      data: formattedSubmission,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
