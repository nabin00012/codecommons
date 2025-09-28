import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting file upload process...");

    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.log("No authentication token provided");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const authData = await authService.verifyToken(token);
    if (!authData || !authData._id) {
      console.log("Invalid authentication token");
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }
    const user = authData;
    console.log("Authentication successful for user:", user._id);

    // Connect to database
    await connectDB();
    console.log("Database connected successfully");

    // Get form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const type = formData.get("type") as string;
    const projectId = formData.get("projectId") as string;

    console.log("Received upload request:", {
      fileCount: files.length,
      type,
      projectId,
    });

    if (!files.length || !type || !projectId) {
      console.log("Missing required fields:", {
        files: !!files.length,
        type,
        projectId,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find project and verify ownership
    const project = await Project.findById(projectId);
    if (!project) {
      console.log("Project not found:", projectId);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Convert both IDs to strings for comparison
    const projectAuthorId = project.author._id.toString();
    const userId = user._id.toString();

    console.log("Checking project ownership:", {
      projectAuthorId,
      userId,
      match: projectAuthorId === userId,
    });

    if (projectAuthorId !== userId) {
      console.log("Unauthorized access attempt:", {
        projectAuthor: projectAuthorId,
        userId: userId,
      });
      return NextResponse.json(
        { error: "Not authorized to modify this project" },
        { status: 403 }
      );
    }
    console.log("Project ownership verified");

    // Process uploaded files
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          console.log("Processing file:", {
            name: file.name,
            type: file.type,
            size: file.size,
          });

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
          const uniqueId = uuidv4();
          const extension = file.name.split(".").pop();
          const filename = `${uniqueId}.${extension}`;

          // Determine upload directory based on file type
          let uploadDir = join(process.cwd(), "public", "uploads");
          if (type === "media") {
            uploadDir = join(uploadDir, "media");
          } else if (type === "screenshots") {
            uploadDir = join(uploadDir, "screenshots");
          } else if (type === "recordings") {
            uploadDir = join(uploadDir, "recordings");
          }

          console.log("Upload directory:", uploadDir);

          // Create directory if it doesn't exist
          if (!existsSync(uploadDir)) {
            console.log("Creating directory:", uploadDir);
            await mkdir(uploadDir, { recursive: true });
          }

          // Write file
          const filePath = join(uploadDir, filename);
          console.log("Writing file to:", filePath);
          await writeFile(filePath, buffer);
          console.log("File written successfully");

          // Return file information
          return {
            url: `/uploads/${type}/${filename}`,
            type: file.type.startsWith("image/") ? "image" : "video",
            caption: file.name,
          };
        } catch (error) {
          console.error("Error processing file:", error);
          throw error;
        }
      })
    );

    console.log("All files processed successfully");

    // Update project with new files
    const updateField =
      type === "media"
        ? "media"
        : type === "screenshots"
        ? "screenshots"
        : "screenRecordings";

    project[updateField] = [...project[updateField], ...uploadedFiles];
    await project.save();
    console.log("Project updated successfully");

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
