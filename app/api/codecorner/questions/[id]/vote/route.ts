import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { authService } from "@/lib/services/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Starting vote operation for question:", params.id);

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
    const db = await connectToDatabase();
    const { id } = params;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      console.log("Invalid question ID format:", id);
      return NextResponse.json(
        { error: "Invalid question ID format" },
        { status: 400 }
      );
    }

    console.log("Finding question...");
    // Find the question
    const question = await db.collection("questions").findOne({
      _id: new ObjectId(id),
    });

    if (!question) {
      console.log("Question not found:", id);
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    console.log("Found question:", {
      id: question._id,
      title: question.title,
      author: question.author,
    });

    console.log("Updating question votes...");
    // Update question votes
    const updateResult = await db
      .collection("questions")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { votes: 1 } });

    console.log("Update result:", updateResult);

    // Add points to the question author
    if (question.author && question.author._id) {
      console.log("Updating author points for:", question.author._id);
      const authorUpdateResult = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(question.author._id) },
          { $inc: { points: 2 } }
        );
      console.log("Author update result:", authorUpdateResult);
    } else {
      console.log("No author information found for question");
    }

    console.log("Vote operation completed successfully");
    return NextResponse.json({
      message: "Vote recorded successfully",
      questionId: id,
      votes: question.votes + 1,
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
