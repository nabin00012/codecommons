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
    const body = await request.json();
    const voteType = body.type || "up"; // Default to upvote if not specified

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

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

      // Check if user has already voted
      const userVote = await db.collection("votes").findOne({
        userId: new ObjectId(user.id),
        contentId: new ObjectId(id),
        contentType: "question",
      });

      if (userVote) {
        // If user is voting the same way, remove the vote
        if (userVote.voteType === voteType) {
          await db.collection("votes").deleteOne({
            userId: new ObjectId(user.id),
            contentId: new ObjectId(id),
            contentType: "question",
          });

          // Update question votes
          const updateFields: any = {};
          if (voteType === "up") {
            updateFields.$inc = { likes: -1 };
          } else {
            updateFields.$inc = { dislikes: -1 };
          }

          await db
            .collection("questions")
            .updateOne({ _id: new ObjectId(id) }, updateFields);
        } else {
          // If user is changing their vote
          await db.collection("votes").updateOne(
            {
              userId: new ObjectId(user.id),
              contentId: new ObjectId(id),
              contentType: "question",
            },
            { $set: { voteType } }
          );

          // Update question votes
          const updateFields: any = {};
          if (voteType === "up") {
            updateFields.$inc = { likes: 1, dislikes: -1 };
          } else {
            updateFields.$inc = { likes: -1, dislikes: 1 };
          }

          await db
            .collection("questions")
            .updateOne({ _id: new ObjectId(id) }, updateFields);
        }
      } else {
        // New vote
        await db.collection("votes").insertOne({
          userId: new ObjectId(user.id),
          contentId: new ObjectId(id),
          contentType: "question",
          voteType,
          createdAt: new Date(),
        });

        // Update question votes
        const updateFields: any = {};
        if (voteType === "up") {
          updateFields.$inc = { likes: 1 };
        } else {
          updateFields.$inc = { dislikes: 1 };
        }

        await db
          .collection("questions")
          .updateOne({ _id: new ObjectId(id) }, updateFields);
      }

      // Get updated question
      const updatedQuestion = await db.collection("questions").findOne({
        _id: new ObjectId(id),
      });

      if (!updatedQuestion) {
        return NextResponse.json(
          { error: "Failed to fetch updated question" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Vote recorded successfully",
        likes: updatedQuestion.likes || 0,
        dislikes: updatedQuestion.dislikes || 0,
      });
    } else if (type === "answer") {
      const answer = await db.collection("answers").findOne({
        _id: new ObjectId(id),
      });

      if (!answer) {
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      }

      // Check if user has already voted
      const userVote = await db.collection("votes").findOne({
        userId: new ObjectId(user.id),
        contentId: new ObjectId(id),
        contentType: "answer",
      });

      if (userVote) {
        // If user is voting the same way, remove the vote
        if (userVote.voteType === voteType) {
          await db.collection("votes").deleteOne({
            userId: new ObjectId(user.id),
            contentId: new ObjectId(id),
            contentType: "answer",
          });

          // Update answer votes
          const updateFields: any = {};
          if (voteType === "up") {
            updateFields.$inc = { likes: -1 };
          } else {
            updateFields.$inc = { dislikes: -1 };
          }

          await db
            .collection("answers")
            .updateOne({ _id: new ObjectId(id) }, updateFields);
        } else {
          // If user is changing their vote
          await db.collection("votes").updateOne(
            {
              userId: new ObjectId(user.id),
              contentId: new ObjectId(id),
              contentType: "answer",
            },
            { $set: { voteType } }
          );

          // Update answer votes
          const updateFields: any = {};
          if (voteType === "up") {
            updateFields.$inc = { likes: 1, dislikes: -1 };
          } else {
            updateFields.$inc = { likes: -1, dislikes: 1 };
          }

          await db
            .collection("answers")
            .updateOne({ _id: new ObjectId(id) }, updateFields);
        }
      } else {
        // New vote
        await db.collection("votes").insertOne({
          userId: new ObjectId(user.id),
          contentId: new ObjectId(id),
          contentType: "answer",
          voteType,
          createdAt: new Date(),
        });

        // Update answer votes
        const updateFields: any = {};
        if (voteType === "up") {
          updateFields.$inc = { likes: 1 };
        } else {
          updateFields.$inc = { dislikes: 1 };
        }

        await db
          .collection("answers")
          .updateOne({ _id: new ObjectId(id) }, updateFields);
      }

      // Get updated answer
      const updatedAnswer = await db.collection("answers").findOne({
        _id: new ObjectId(id),
      });

      if (!updatedAnswer) {
        return NextResponse.json(
          { error: "Failed to fetch updated answer" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Vote recorded successfully",
        likes: updatedAnswer.likes || 0,
        dislikes: updatedAnswer.dislikes || 0,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in vote operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
