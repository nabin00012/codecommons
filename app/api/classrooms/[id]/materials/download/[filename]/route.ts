import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string; filename: string } }
) {
  try {
    const { id, filename } = params;
    console.log("Downloading material:", filename, "from classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;

    const { db } = await connectToDatabase();
    
    // Find the material
    const material = await db.collection("materials").findOne({
      classroomId: id,
      title: decodeURIComponent(filename)
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    if (material.fileContent) {
      // Return file content
      const buffer = Buffer.from(material.fileContent, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': material.mimeType || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${material.fileName}"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    } else if (material.content) {
      // Return text content
      return new NextResponse(material.content, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="${material.title}.txt"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: "No content available for download" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error downloading material:", error);
    return NextResponse.json(
      { error: "Failed to download material" },
      { status: 500 }
    );
  }
}
