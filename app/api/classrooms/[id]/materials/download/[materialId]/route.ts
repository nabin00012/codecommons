import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; materialId: string } }
) {
  try {
    const { id, materialId } = params;
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find material by title or ID
    let material = await db.collection("materials").findOne({
      classroomId: id,
      title: decodeURIComponent(materialId)
    });

    if (!material) {
      // Try finding by ID if title didn't work
      try {
        const { ObjectId } = require("mongodb");
        material = await db.collection("materials").findOne({
          _id: new ObjectId(materialId),
          classroomId: id
        });
      } catch (e) {
        // Not a valid ObjectId
      }
    }

    if (!material || !material.fileContent) {
      return NextResponse.json(
        { error: "Material not found or has no file content" },
        { status: 404 }
      );
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(material.fileContent, 'base64');
    
    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': material.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${material.fileName}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading material:", error);
    return NextResponse.json(
      { error: "Failed to download material" },
      { status: 500 }
    );
  }
}
