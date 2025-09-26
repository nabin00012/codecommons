import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// Get all discussions
export async function GET(request: NextRequest) {
  try {
    console.log("Fetching discussions...");
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get all questions/discussions
    const discussions = await db.collection("questions").find({}).toArray();

    const formattedDiscussions = discussions.map(discussion => ({
      _id: discussion._id.toString(),
      title: discussion.title,
      content: discussion.content,
      author: discussion.author,
      department: discussion.department,
      tags: discussion.tags || [],
      votes: discussion.votes || 0,
      answers: discussion.answers || [],
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedDiscussions,
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

// Create new discussion
export async function POST(request: NextRequest) {
  try {
    console.log("Creating new discussion...");
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { title, content, tags, department } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const newDiscussion = {
      title,
      content,
      author: decoded.email,
      department: department || "general",
      tags: tags || [],
      votes: 0,
      answers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("questions").insertOne(newDiscussion);

    const formattedDiscussion = {
      _id: result.insertedId.toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: newDiscussion.author,
      department: newDiscussion.department,
      tags: newDiscussion.tags,
      votes: newDiscussion.votes,
      answers: newDiscussion.answers,
      createdAt: newDiscussion.createdAt,
      updatedAt: newDiscussion.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedDiscussion,
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}