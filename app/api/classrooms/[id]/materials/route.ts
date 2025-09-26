import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// Get materials for a classroom
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Fetching materials for classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get materials for this classroom
    const materials = await db.collection("materials").find({ 
      classroomId: id 
    }).toArray();

    const formattedMaterials = materials.map(material => ({
      id: material._id.toString(),
      title: material.title,
      type: material.type || "document",
      size: material.size || "Unknown",
      uploadedOn: material.createdAt,
      fileUrl: material.fileUrl || "#",
      uploadedBy: material.uploadedBy,
    }));

    return NextResponse.json({
      success: true,
      data: formattedMaterials,
    });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}

// Upload new material
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Uploading material to classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const file = formData.get("file") as File;
    const materialType = formData.get("type") as string;
    const textContent = formData.get("content") as string;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    let materialData: any = {
      title,
      type: materialType || "document",
      classroomId: id,
      uploadedBy: decoded.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (file && file.size > 0) {
      // Handle file upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // For demo purposes, we'll store file info and content as base64
      // In production, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
      materialData = {
        ...materialData,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileContent: buffer.toString('base64'),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        fileUrl: `/api/classrooms/${id}/materials/download/${title}`,
      };
    } else if (textContent) {
      // Handle text content
      materialData = {
        ...materialData,
        content: textContent,
        size: `${textContent.length} chars`,
        fileUrl: "#",
      };
    } else {
      return NextResponse.json(
        { error: "Either file or content is required" },
        { status: 400 }
      );
    }

    const result = await db.collection("materials").insertOne(materialData);

    const formattedMaterial = {
      id: result.insertedId.toString(),
      title: materialData.title,
      type: materialData.type,
      size: materialData.size,
      uploadedOn: materialData.createdAt,
      fileUrl: materialData.fileUrl,
      uploadedBy: materialData.uploadedBy,
      fileName: materialData.fileName,
      mimeType: materialData.mimeType,
    };

    return NextResponse.json({
      success: true,
      data: formattedMaterial,
    });
  } catch (error) {
    console.error("Error uploading material:", error);
    return NextResponse.json(
      { error: "Failed to upload material" },
      { status: 500 }
    );
  }
}