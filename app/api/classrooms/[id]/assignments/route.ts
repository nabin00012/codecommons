import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

// Get assignments for a classroom
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Fetching assignments for classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;

    const { db } = await connectToDatabase();
    
    // Get assignments for this classroom
    const assignments = await db.collection("assignments").find({ 
      classroomId: id 
    }).toArray();

    const formattedAssignments = assignments.map(assignment => ({
      _id: assignment._id.toString(),
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points || 100,
      classroomId: assignment.classroomId,
      createdBy: assignment.createdBy,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

// Create new assignment
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Creating assignment for classroom:", id);
    
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { title, description, dueDate, points } = await request.json();

    if (!title || !description || !dueDate) {
      return NextResponse.json(
        { error: "Title, description, and due date are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const newAssignment = {
      title,
      description,
      dueDate: new Date(dueDate),
      points: parseInt(points) || 100,
      classroomId: id,
      createdBy: decoded.email,
      submissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("assignments").insertOne(newAssignment);

    const formattedAssignment = {
      _id: result.insertedId.toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      points: newAssignment.points,
      classroomId: newAssignment.classroomId,
      createdBy: newAssignment.createdBy,
      createdAt: newAssignment.createdAt,
      updatedAt: newAssignment.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
