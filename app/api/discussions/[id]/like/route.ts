import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/lib/models/Discussion";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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
    const hasLiked = discussion.likes.includes(userId as any);

    if (hasLiked) {
      discussion.likes = discussion.likes.filter(
        (id: string) => id.toString() !== userId
      );
    } else {
      discussion.likes.push(userId as any);
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
