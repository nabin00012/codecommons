import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Verify user is a teacher
    if (user.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Only teachers can upload materials" },
        { status: 403 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file || !title) {
      return NextResponse.json(
        { success: false, message: "File and title are required" },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Verify classroom exists and user is the teacher
    const classroom = await db.collection("classrooms").findOne({
      _id: new ObjectId(params.id),
    });

    if (!classroom) {
      return NextResponse.json(
        { success: false, message: "Classroom not found" },
        { status: 404 }
      );
    }

    if (classroom.teacher.toString() !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not the teacher of this classroom",
        },
        { status: 403 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "materials");
    await writeFile(join(uploadsDir, ".gitkeep"), "");

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create material record
    const material = {
      id: uuidv4(),
      title,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadedOn: new Date().toISOString(),
      fileUrl: `/uploads/materials/${fileName}`,
    };

    // Update classroom with new material
    await db
      .collection("classrooms")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $push: { materials: material } }
      );

    return NextResponse.json(
      { success: true, data: material },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading material:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload material" },
      { status: 500 }
    );
  }
}
