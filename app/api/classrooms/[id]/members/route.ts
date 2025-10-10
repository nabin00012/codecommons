import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// Get members of a classroom
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Fetching members for classroom:", id);

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Get classroom
    const classroom = await db
      .collection("classrooms")
      .findOne({ _id: new ObjectId(id) });

    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 }
      );
    }

    // Get teacher info
    const teacher = await db
      .collection("users")
      .findOne({ email: classroom.instructorId });

    // Get students info
    const students = await db
      .collection("users")
      .find({
        email: { $in: classroom.students || [] },
      })
      .toArray();

    const members = [
      {
        _id: teacher?._id?.toString() || "teacher-id",
        name: teacher?.name || "Faculty Member",
        email: classroom.instructorId,
        role: "teacher",
        department: teacher?.department || "Engineering",
        joinedAt: classroom.createdAt,
        profileImage: teacher?.profileImage || null,
      },
      ...students.map((student) => ({
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        role: "student",
        department: student.department || "Engineering",
        joinedAt: student.createdAt,
        profileImage: student.profileImage || null,
      })),
    ];

    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// Remove student from classroom
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { studentEmail } = await request.json();

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

    // Check if user is teacher of this classroom
    const classroom = await db.collection("classrooms").findOne({
      _id: new ObjectId(id),
      instructorId: decoded.email,
    });

    if (!classroom) {
      return NextResponse.json(
        { error: "Not authorized to remove students from this classroom" },
        { status: 403 }
      );
    }

    // Remove student from classroom
    await db.collection("classrooms").updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { students: studentEmail },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Student removed successfully",
    });
  } catch (error) {
    console.error("Error removing student:", error);
    return NextResponse.json(
      { error: "Failed to remove student" },
      { status: 500 }
    );
  }
}
