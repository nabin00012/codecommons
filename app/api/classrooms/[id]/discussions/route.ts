import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// Get discussions for a classroom
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Fetching discussions for classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get discussions for this classroom
    const discussions = await db.collection("classroom_discussions").find({ 
      classroomId: id 
    }).sort({ createdAt: -1 }).toArray();

    const formattedDiscussions = discussions.map(discussion => ({
      _id: discussion._id.toString(),
      title: discussion.title,
      content: discussion.content,
      author: discussion.author,
      authorName: discussion.authorName,
      authorRole: discussion.authorRole,
      replies: discussion.replies || [],
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedDiscussions,
    });
  } catch (error) {
    console.error("Error fetching classroom discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

// Create new classroom discussion
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Creating discussion for classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get user info for display
    const user = await db.collection("users").findOne({ email: decoded.email });
    
    const newDiscussion = {
      title,
      content,
      author: decoded.email,
      authorName: user?.name || "Unknown User",
      authorRole: user?.role || "user",
      classroomId: id,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("classroom_discussions").insertOne(newDiscussion);

    const formattedDiscussion = {
      _id: result.insertedId.toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: newDiscussion.author,
      authorName: newDiscussion.authorName,
      authorRole: newDiscussion.authorRole,
      replies: newDiscussion.replies,
      createdAt: newDiscussion.createdAt,
      updatedAt: newDiscussion.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedDiscussion,
    });
  } catch (error) {
    console.error("Error creating classroom discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
