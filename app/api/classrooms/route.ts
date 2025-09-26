import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching classrooms from frontend API...");
    
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
    
    // Get all classrooms
    const classrooms = await db.collection("classrooms").find({}).toArray();
    console.log("Found classrooms:", classrooms.length);

    // Format classrooms for frontend
    const formattedClassrooms = classrooms.map(classroom => ({
      _id: classroom._id.toString(),
      name: classroom.name,
      description: classroom.description,
      code: classroom.code,
      department: classroom.department,
      year: classroom.year,
      section: classroom.section,
      instructor: {
        name: "Faculty Member",
        avatar: "/placeholder.svg",
        department: classroom.department || "Engineering",
      },
      teacher: {
        _id: "teacher-id",
        name: "Faculty Member", 
        email: classroom.instructorId || "faculty@jainuniversity.ac.in",
      },
      students: classroom.students || [],
      materials: [],
      semester: `${classroom.year || 1}`,
      createdAt: classroom.createdAt,
      updatedAt: classroom.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedClassrooms,
    });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}
