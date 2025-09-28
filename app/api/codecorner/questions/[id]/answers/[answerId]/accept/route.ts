import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Question } from "@/lib/models/question";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string; answerId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: questionId, answerId } = params;
    await connectToDatabase();

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check if user is the question author
    if (question.author._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Only the question author can accept answers" },
        { status: 403 }
      );
    }

    // Find the answer in the question's answers array
    const answer = question.answers.id(answerId);
    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    // Toggle accepted status
    answer.isAccepted = !answer.isAccepted;
    await question.save();

    return NextResponse.json({
      success: true,
      isAccepted: answer.isAccepted,
    });
  } catch (error) {
    console.error("Error accepting answer:", error);
    return NextResponse.json(
      { error: "Failed to accept answer" },
      { status: 500 }
    );
  }
}