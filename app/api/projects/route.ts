import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { headers } from "next/headers";

// Temporary in-memory storage
let projects: any[] = [];

export async function GET() {
  try {
    const headersList = headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

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
    const headersList = headers();
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
    const { title, description, githubLink, tags } = body;

    if (!title || !description || !githubLink) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = {
      _id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      githubLink,
      tags: tags || [],
      author: {
        _id: user.user._id,
        name: user.user.name,
        role: user.user.role,
      },
      createdAt: new Date().toISOString(),
      stars: 0,
      contributors: 1,
    };

    projects.push(project);

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
