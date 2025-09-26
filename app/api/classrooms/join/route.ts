import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log("Student joining classroom by code...");
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    console.log("User authenticated:", decoded.email);

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Classroom code is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find classroom by code
    const classroom = await db.collection("classrooms").findOne({ code: code.toUpperCase() });
    
    if (!classroom) {
      return NextResponse.json(
        { error: "Invalid classroom code" },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    if (classroom.students && classroom.students.includes(decoded.email)) {
      return NextResponse.json(
        { error: "You are already enrolled in this classroom" },
        { status: 400 }
      );
    }

    // Add student to classroom
    await db.collection("classrooms").updateOne(
      { _id: classroom._id },
      { 
        $addToSet: { students: decoded.email },
        $set: { updatedAt: new Date() }
      }
    );

    console.log("Student enrolled successfully:", decoded.email, "in", classroom.name);

    // Return the classroom data
    const formattedClassroom = {
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
      students: [...(classroom.students || []), decoded.email],
      materials: [],
      semester: `${classroom.year || 1}`,
      createdAt: classroom.createdAt,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: formattedClassroom,
      message: `Successfully joined ${classroom.name}`,
    });
  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json(
      { error: "Failed to join classroom" },
      { status: 500 }
    );
  }
}
