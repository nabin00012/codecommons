import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { Classroom } from "@/lib/models/Classroom";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, type, fileUrl, size } = await req.json();
    if (!title || !type || !fileUrl) {
      return NextResponse.json(
        { error: "Title, type, and file URL are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const classroom = await Classroom.findById(params.id);
    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 }
      );
    }

    const material = {
      id: new Date().getTime().toString(),
      title,
      type,
      size: size || "0",
      uploadedOn: new Date().toISOString(),
      fileUrl,
    };

    classroom.materials.push(material);
    await classroom.save();

    return NextResponse.json({ materials: classroom.materials });
  } catch (error) {
    console.error("Error adding material:", error);
    return NextResponse.json(
      { error: "Failed to add material" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const classroom = await Classroom.findById(params.id);
    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ materials: classroom.materials });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}
