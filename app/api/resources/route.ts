import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const resources = await db
      .collection("resources")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Format resources for frontend
    const formattedResources = resources.map((resource) => ({
      _id: resource._id.toString(),
      title: resource.title,
      description: resource.description,
      category: resource.category,
      link: resource.link,
      upvotes: resource.upvotes || 0,
      bookmarks: resource.bookmarks || 0,
      comments: resource.comments || 0,
      isVerified: resource.isVerified || false,
      author: {
        name: resource.authorName || "Anonymous",
        role: resource.authorRole || "student",
      },
      createdAt: resource.createdAt,
      hasUpvoted: false, // TODO: Check if current user has upvoted
      hasBookmarked: false, // TODO: Check if current user has bookmarked
    }));

    return NextResponse.json({
      success: true,
      resources: formattedResources,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from auth token
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

    const body = await request.json();
    const { title, description, category, link } = body;

    if (!title || !description || !category || !link) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get user details
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) });

    const newResource = {
      title,
      description,
      category,
      link,
      authorId: decoded.userId,
      authorName: user?.name || "Anonymous",
      authorRole: user?.role || "student",
      upvotes: 0,
      bookmarks: 0,
      comments: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("resources").insertOne(newResource);

    return NextResponse.json({
      success: true,
      resourceId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
