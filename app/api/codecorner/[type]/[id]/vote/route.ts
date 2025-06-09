import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Question } from "@/lib/models/question";
import { Answer } from "@/lib/models/answer";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { voteType } = await req.json();
    if (!voteType || !["up", "down"].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    await connectToDatabase();

    if (params.type === "questions") {
      const question = await Question.findById(params.id);
      if (!question) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      }

      const userId = session.user.id;
      const hasUpvoted = question.upvotes.includes(userId);
      const hasDownvoted = question.downvotes.includes(userId);

      if (voteType === "up") {
        if (hasUpvoted) {
          question.upvotes = question.upvotes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          question.upvotes.push(userId);
          if (hasDownvoted) {
            question.downvotes = question.downvotes.filter(
              (id) => id.toString() !== userId
            );
          }
        }
      } else {
        if (hasDownvoted) {
          question.downvotes = question.downvotes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          question.downvotes.push(userId);
          if (hasUpvoted) {
            question.upvotes = question.upvotes.filter(
              (id) => id.toString() !== userId
            );
          }
        }
      }

      await question.save();
      return NextResponse.json(question);
    } else if (params.type === "answers") {
      const answer = await Answer.findById(params.id);
      if (!answer) {
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      }

      const userId = session.user.id;
      const hasUpvoted = answer.upvotes.includes(userId);
      const hasDownvoted = answer.downvotes.includes(userId);

      if (voteType === "up") {
        if (hasUpvoted) {
          answer.upvotes = answer.upvotes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          answer.upvotes.push(userId);
          if (hasDownvoted) {
            answer.downvotes = answer.downvotes.filter(
              (id) => id.toString() !== userId
            );
          }
        }
      } else {
        if (hasDownvoted) {
          answer.downvotes = answer.downvotes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          answer.downvotes.push(userId);
          if (hasUpvoted) {
            answer.upvotes = answer.upvotes.filter(
              (id) => id.toString() !== userId
            );
          }
        }
      }

      await answer.save();
      return NextResponse.json(answer);
    }

    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
