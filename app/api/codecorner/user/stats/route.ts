import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { authService } from "@/lib/services/auth";

export async function GET(request: Request) {
  try {
    // Verify the user's token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userData = await authService.verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Get user's questions
    const questions = await db
      .collection("questions")
      .find({ "author._id": userData.user._id })
      .toArray();

    // Get user's answers
    const answers = await db
      .collection("questions")
      .aggregate([
        { $unwind: "$answers" },
        { $match: { "answers.author._id": userData.user._id } },
        { $project: { answer: "$answers" } },
      ])
      .toArray();

    // Calculate stats
    const totalPoints =
      questions.reduce(
        (acc, q) => acc + (q.likes || 0) - (q.dislikes || 0),
        0
      ) +
      answers.reduce(
        (acc, a) => acc + (a.answer.likes || 0) - (a.answer.dislikes || 0),
        0
      );

    // Get recent activities
    const recentActivities = [
      ...questions.map((q) => ({
        type: "question" as const,
        title: q.title,
        points: (q.likes || 0) - (q.dislikes || 0),
        timestamp: q.createdAt,
        status: (q.likes || 0) > (q.dislikes || 0) ? "positive" : "negative",
      })),
      ...answers.map((a) => ({
        type: "answer" as const,
        title: a.answer.content.substring(0, 50) + "...",
        points: (a.answer.likes || 0) - (a.answer.dislikes || 0),
        timestamp: a.answer.createdAt,
        status:
          (a.answer.likes || 0) > (a.answer.dislikes || 0)
            ? "positive"
            : "negative",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10); // Get last 10 activities

    // Calculate upvotes and downvotes
    const upvotesReceived =
      questions.reduce((acc, q) => acc + (q.likes || 0), 0) +
      answers.reduce((acc, a) => acc + (a.answer.likes || 0), 0);

    const downvotesReceived =
      questions.reduce((acc, q) => acc + (q.dislikes || 0), 0) +
      answers.reduce((acc, a) => acc + (a.answer.dislikes || 0), 0);

    return NextResponse.json({
      totalPoints,
      questionsAsked: questions.length,
      answersGiven: answers.length,
      upvotesReceived,
      downvotesReceived,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
