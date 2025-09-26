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
    
    // For now, we'll handle text-based materials
    const { title, content, type } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const newMaterial = {
      title,
      content,
      type: type || "document",
      size: `${content.length} chars`,
      classroomId: id,
      uploadedBy: decoded.email,
      fileUrl: "#",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("materials").insertOne(newMaterial);

    const formattedMaterial = {
      id: result.insertedId.toString(),
      title: newMaterial.title,
      type: newMaterial.type,
      size: newMaterial.size,
      uploadedOn: newMaterial.createdAt,
      fileUrl: newMaterial.fileUrl,
      uploadedBy: newMaterial.uploadedBy,
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