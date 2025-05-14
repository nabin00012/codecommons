import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authService } from "@/lib/services/auth";

export async function POST(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const { type, id } = params;

    if (type === "question") {
      const question = await db.collection("questions").findOne({
        _id: new ObjectId(id),
      });

      if (!question) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      }

      // Update question votes
      await db
        .collection("questions")
        .updateOne({ _id: new ObjectId(id) }, { $inc: { votes: 1 } });

      // Add points to the question author
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(question.author._id) },
          { $inc: { points: 2 } }
        );
    } else if (type === "answer") {
      const question = await db.collection("questions").findOne({
        "answers._id": new ObjectId(id),
      });

      if (!question) {
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      }

      // Find the answer
      const answer = question.answers.find((a: any) => a._id.toString() === id);

      if (!answer) {
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      }

      // Update answer votes
      await db.collection("questions").updateOne(
        {
          _id: question._id,
          "answers._id": new ObjectId(id),
        },
        {
          $inc: { "answers.$.votes": 1 },
        }
      );

      // Add points to the answer author
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(answer.author._id) },
          { $inc: { points: 2 } }
        );
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
