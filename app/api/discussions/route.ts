import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/lib/models/discussion";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";
    const tags = searchParams.get("tags")?.split(",") || [];

    await connectToDatabase();

    const filter: any = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const discussions = await Discussion.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name department avatar")
      .populate("comments.author", "name department avatar");

    const total = await Discussion.countDocuments(filter);

    return NextResponse.json({
      discussions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const discussion = await Discussion.create({
      title,
      content,
      tags,
      author: session.user.id,
      likes: [],
      comments: [],
    });

    await discussion.populate("author", "name department avatar");

    return NextResponse.json(discussion);
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
