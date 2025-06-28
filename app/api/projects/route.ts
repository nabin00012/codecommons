import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    // Connect to MongoDB only when needed
    const { db } = await connectToDatabase();

    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // If ID is provided, get specific project
    if (id) {
      const project = await db
        .collection("projects")
        .findOne({ _id: new ObjectId(id) });
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }

    // Otherwise get all projects
    const projects = await db
      .collection("projects")
      .find({
        $or: [
          { "author._id": user._id }, // User's own projects
          { isPublic: true }, // Public projects
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Connect to MongoDB only when needed
    const { db } = await connectToDatabase();

    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      longDescription,
      githubLink,
      demoLink,
      tags,
      media,
      screenshots,
      screenRecordings,
    } = body;

    if (!title || !description || !longDescription || !githubLink) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = {
      title,
      description,
      longDescription,
      githubLink,
      demoLink,
      tags: tags || [],
      media: media || [],
      screenshots: screenshots || [],
      screenRecordings: screenRecordings || [],
      author: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("projects").insertOne(project);
    const createdProject = await db
      .collection("projects")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(createdProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
