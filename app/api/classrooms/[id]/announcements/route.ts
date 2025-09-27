import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// Get announcements for a classroom
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Fetching announcements for classroom:", id);

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Get announcements for this classroom
    const announcements = await db
      .collection("announcements")
      .find({
        classroomId: id,
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedAnnouncements = announcements.map((announcement) => ({
      _id: announcement._id.toString(),
      title: announcement.title,
      content: announcement.content,
      author: announcement.author,
      authorName: announcement.authorName,
      isPinned: announcement.isPinned || false,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedAnnouncements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// Create new announcement
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Creating announcement for classroom:", id);

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    ) as any;
    const { title, content, isPinned } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get user info
    const user = await db.collection("users").findOne({ email: decoded.email });

    const newAnnouncement = {
      title,
      content,
      author: decoded.email,
      authorName: user?.name || "Unknown User",
      classroomId: id,
      isPinned: isPinned || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("announcements")
      .insertOne(newAnnouncement);

    const formattedAnnouncement = {
      _id: result.insertedId.toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: newAnnouncement.author,
      authorName: newAnnouncement.authorName,
      isPinned: newAnnouncement.isPinned,
      createdAt: newAnnouncement.createdAt,
      updatedAt: newAnnouncement.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
