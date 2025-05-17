import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const type = formData.get("type") as string;
    const projectId = formData.get("projectId") as string;

    if (!files.length || !type || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find project and verify ownership
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.author._id.toString() !== user._id) {
      return NextResponse.json(
        { error: "Not authorized to modify this project" },
        { status: 403 }
      );
    }

    // Process uploaded files
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const uniqueId = uuidv4();
        const extension = file.name.split(".").pop();
        const filename = `${uniqueId}.${extension}`;

        // Determine upload directory based on file type
        let uploadDir = "public/uploads";
        if (type === "media") {
          uploadDir = "public/uploads/media";
        } else if (type === "screenshots") {
          uploadDir = "public/uploads/screenshots";
        } else if (type === "recordings") {
          uploadDir = "public/uploads/recordings";
        }

        // Create directory if it doesn't exist
        await writeFile(join(process.cwd(), uploadDir, filename), buffer);

        // Return file information
        return {
          url: `/${uploadDir.replace("public", "")}/${filename}`,
          type: file.type.startsWith("image/") ? "image" : "video",
          caption: file.name,
        };
      })
    );

    // Update project with new files
    const updateField =
      type === "media"
        ? "media"
        : type === "screenshots"
        ? "screenshots"
        : "screenRecordings";

    project[updateField] = [...project[updateField], ...uploadedFiles];
    await project.save();

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
