import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log("Creating new classroom...");
    
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

    const { name, description, semester } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Generate classroom code
    const code = `${name.replace(/\s+/g, "").toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    // Create classroom
    const newClassroom = {
      name,
      description,
      code,
      department: "general",
      year: parseInt(semester) || 1,
      section: "A",
      instructorId: decoded.email,
      students: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("classrooms").insertOne(newClassroom);
    console.log("Classroom created with ID:", result.insertedId);

    // Format classroom for frontend
    const formattedClassroom = {
      _id: result.insertedId.toString(),
      name: newClassroom.name,
      description: newClassroom.description,
      code: newClassroom.code,
      department: newClassroom.department,
      year: newClassroom.year,
      section: newClassroom.section,
      instructor: {
        name: "Faculty Member",
        avatar: "/placeholder.svg",
        department: newClassroom.department,
      },
      teacher: {
        _id: "teacher-id",
        name: "Faculty Member", 
        email: newClassroom.instructorId,
      },
      students: [],
      materials: [],
      semester: newClassroom.year.toString(),
      createdAt: newClassroom.createdAt,
      updatedAt: newClassroom.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedClassroom,
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}

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
    
    // Get user's classrooms only (created by them or enrolled in)
    const userClassrooms = await db.collection("classrooms").find({
      $or: [
        { instructorId: decoded.email }, // Classrooms created by user
        { students: decoded.email }      // Classrooms user is enrolled in
      ]
    }).toArray();
    console.log("Found user's classrooms:", userClassrooms.length);

    // Format classrooms for frontend
    const formattedClassrooms = userClassrooms.map(classroom => ({
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
