import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/lib/models/Discussion";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add custom authentication/authorization here
    // Remove session-based checks

    await connectToDatabase();

    const discussion = await Discussion.findById(params.id);
    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    // TODO: Replace with actual user ID from your custom auth
    const userId = "mock-user-id";
    const hasLiked = discussion.likes.includes(userId);

    if (hasLiked) {
      // Remove user's like
      discussion.likes = discussion.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Add user's like
      discussion.likes.push(userId);
    }

    await discussion.save();

    return NextResponse.json({
      hasLiked: !hasLiked,
      likes: discussion.likes,
    });
  } catch (error) {
    console.error("Error toggling discussion like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
