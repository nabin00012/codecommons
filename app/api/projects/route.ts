import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching projects from frontend API...");
    
    // Get user from auth token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    console.log("User authenticated:", decoded.email);

    const { db } = await connectToDatabase();
    
    // Get all projects
    const projects = await db.collection("projects").find({}).toArray();
    console.log("Found projects:", projects.length);

    // Format projects for frontend
    const formattedProjects = projects.map(project => ({
      _id: project._id.toString(),
      title: project.title,
      description: project.description,
      department: project.department,
      ownerId: project.ownerId,
      visibility: project.visibility || "public",
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}