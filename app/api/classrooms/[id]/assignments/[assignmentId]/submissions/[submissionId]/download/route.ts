import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

// Download submission attachment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string; submissionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const fileIndex = searchParams.get("fileIndex");
    
    if (fileIndex === null) {
      return NextResponse.json(
        { error: "File index is required" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret");
    const { db } = await connectToDatabase();

    // Find submission
    const submission = await db.collection("submissions").findOne({
      _id: new ObjectId(params.submissionId)
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const attachments = submission.attachments || [];
    const fileIdx = parseInt(fileIndex);
    
    if (fileIdx < 0 || fileIdx >= attachments.length) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const file = attachments[fileIdx];
    
    if (!file.content) {
      return NextResponse.json(
        { error: "File content not found. This submission was created before file storage was implemented. Please resubmit the assignment." },
        { status: 404 }
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file.content, 'base64');

    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading submission file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
