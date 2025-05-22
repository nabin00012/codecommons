import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/lib/models/Discussion";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const discussion = await Discussion.findById(params.id);
    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
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
