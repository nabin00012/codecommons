import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { headers } from "next/headers";
import Project from "@/lib/models/Project";
import { connectDB } from "@/lib/db";

// Connect to MongoDB
connectDB();

export async function GET(request: Request) {
  try {
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
      const project = await Project.findById(id);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }

    // Otherwise get all projects
    const projects = await Project.find().sort({ createdAt: -1 });
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

    const project = await Project.create({
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
        _id: user.user._id,
        name: user.user.name,
        role: user.user.role,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
