import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authService } from "@/lib/services/auth";
import { Answer } from "@/lib/models/answer";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Starting vote operation for answer:", params.id);

    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      console.log("Invalid token");
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    console.log("Connecting to database...");
    const { db } = await connectToDatabase();
    const { id } = params;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      console.log("Invalid answer ID format:", id);
      return NextResponse.json(
        { error: "Invalid answer ID format" },
        { status: 400 }
      );
    }

    console.log("Finding answer...");
    // Find the answer
    const answer = await db.collection("answers").findOne({
      _id: new ObjectId(id),
    });

    if (!answer) {
      console.log("Answer not found:", id);
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    console.log("Found answer:", {
      id: answer._id,
      content: answer.content,
      author: answer.author,
    });

    console.log("Updating answer votes...");
    // Update answer votes
    const updateResult = await db
      .collection("answers")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { votes: 1 } });

    console.log("Update result:", updateResult);

    // Add points to the answer author
    if (answer.author && answer.author._id) {
      console.log("Updating author points for:", answer.author._id);
      const authorUpdateResult = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(answer.author._id) },
          { $inc: { points: 2 } }
        );
      console.log("Author update result:", authorUpdateResult);
    } else {
      console.log("No author information found for answer");
    }

    console.log("Vote operation completed successfully");
    return NextResponse.json({
      message: "Vote recorded successfully",
      answerId: id,
      votes: answer.votes + 1,
    });
  } catch (error) {
    console.error("Error recording vote:", error);
    // Log the full error details
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return NextResponse.json(
      {
        error: "Failed to record vote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
