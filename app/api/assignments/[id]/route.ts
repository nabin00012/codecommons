import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// Get assignment details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Fetching assignment:", id);

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Get assignment
    const assignment = await db
      .collection("assignments")
      .findOne({ _id: new ObjectId(id) });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    const formattedAssignment = {
      _id: assignment._id.toString(),
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points,
      classroomId: assignment.classroomId,
      createdAt: assignment.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedAssignment,
    });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 }
    );
  }
}

// Update assignment (teacher only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { title, description, dueDate, points } = await request.json();

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    ) as any;

    const { db } = await connectToDatabase();

    // Check if user is teacher of this assignment's classroom
    const assignment = await db
      .collection("assignments")
      .findOne({ _id: new ObjectId(id) });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    const classroom = await db.collection("classrooms").findOne({
      _id: new ObjectId(assignment.classroomId),
    });

    // Check if the current user is the instructor/teacher of this classroom
    if (!classroom || classroom.instructorId !== decoded.email) {
      return NextResponse.json(
        { error: "Not authorized to update this assignment" },
        { status: 403 }
      );
    }

    // Update assignment
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (dueDate) updateData.dueDate = dueDate;
    if (points) updateData.points = points;

    await db
      .collection("assignments")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    const updatedAssignment = await db
      .collection("assignments")
      .findOne({ _id: new ObjectId(id) });

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found after update" },
        { status: 404 }
      );
    }

    const formattedAssignment = {
      _id: updatedAssignment._id.toString(),
      title: updatedAssignment.title,
      description: updatedAssignment.description,
      dueDate: updatedAssignment.dueDate,
      points: updatedAssignment.points,
      classroomId: updatedAssignment.classroomId,
      createdAt: updatedAssignment.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedAssignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}

// Delete assignment (teacher only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    ) as any;

    const { db } = await connectToDatabase();

    // Check if user is teacher of this assignment's classroom
    const assignment = await db
      .collection("assignments")
      .findOne({ _id: new ObjectId(id) });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    const classroom = await db.collection("classrooms").findOne({
      _id: new ObjectId(assignment.classroomId),
    });

    // Check if the current user is the instructor/teacher of this classroom
    if (!classroom || classroom.instructorId !== decoded.email) {
      return NextResponse.json(
        { error: "Not authorized to delete this assignment" },
        { status: 403 }
      );
    }

    // Delete assignment and related submissions
    await db.collection("assignments").deleteOne({ _id: new ObjectId(id) });
    await db.collection("submissions").deleteMany({ assignmentId: id });

    return NextResponse.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
