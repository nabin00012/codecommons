import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add custom authentication/authorization here
    // Remove session-based checks

    const { db } = await connectToDatabase();

    // Get classroom (authorization logic should be added here)
    const classroom = await db.collection("classrooms").findOne({
      _id: new ObjectId(params.id),
    });

    if (!classroom) {
      return new NextResponse("Classroom not found", { status: 404 });
    }

    // Get all students in the classroom
    const students = await db
      .collection("users")
      .find({
        _id: { $in: classroom.students.map((s: any) => new ObjectId(s._id)) },
        role: "student",
      })
      .toArray();

    // Get statistics for each student
    const studentStats = await db
      .collection("userStats")
      .find({
        userId: { $in: students.map((s) => s._id) },
      })
      .toArray();

    // Create a map of student stats for easy lookup
    const statsMap = new Map(
      studentStats.map((stat) => [stat.userId.toString(), stat])
    );

    // Combine student data with their stats
    const studentsWithStats = students.map((student) => {
      const stats = statsMap.get(student._id.toString());
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        joinDate: student.createdAt,
        points: stats?.points || 0,
        solutions: stats?.solutions || 0,
        questions: stats?.questions || 0,
      };
    });

    return NextResponse.json(studentsWithStats);
  } catch (error) {
    console.error("Error fetching classroom students:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
