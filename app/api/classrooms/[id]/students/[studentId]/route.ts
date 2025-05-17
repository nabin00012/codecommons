import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.id) {
      console.log("No session or user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const { id: classroomId, studentId } = params;
    console.log("Classroom ID:", classroomId, "Student ID:", studentId);

    // Check if user is authorized to view this student's profile
    const classroom = await db.collection("classrooms").findOne({
      _id: new ObjectId(classroomId),
      $or: [
        { teacher: new ObjectId(session.user.id) },
        { students: new ObjectId(session.user.id) },
      ],
    });

    console.log("Classroom query result:", classroom);

    if (!classroom) {
      console.log("Classroom not found or user not authorized");
      return NextResponse.json(
        { error: "Not authorized to view this classroom" },
        { status: 403 }
      );
    }

    // Get student data
    const student = await db.collection("users").findOne({
      _id: new ObjectId(studentId),
    });

    console.log("Student query result:", student);

    if (!student) {
      console.log("Student not found");
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get student's language proficiencies
    const languages = await db
      .collection("userLanguages")
      .find({ userId: new ObjectId(studentId) })
      .toArray();

    console.log("Languages found:", languages.length);

    // Get student's achievements
    const achievements = await db
      .collection("achievements")
      .find({ userId: new ObjectId(studentId) })
      .toArray();

    console.log("Achievements found:", achievements.length);

    // Get student's recent activity
    const recentActivity = await db
      .collection("activities")
      .find({ userId: new ObjectId(studentId) })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log("Recent activities found:", recentActivity.length);

    // Get student's projects
    const projects = await db
      .collection("projects")
      .find({ userId: new ObjectId(studentId) })
      .toArray();

    console.log("Projects found:", projects.length);

    const response = {
      student: {
        _id: student._id,
        name: student.name || "",
        email: student.email || "",
        location: student.location || "",
        course: student.course || "",
        semester: student.semester || "",
        bio: student.bio || "",
        githubUrl: student.githubUrl || "",
        linkedinUrl: student.linkedinUrl || "",
        portfolioUrl: student.portfolioUrl || "",
        skills: student.skills || [],
      },
      languages: languages.map((lang) => ({
        name: lang.language,
        proficiency: lang.proficiency,
      })),
      achievements: achievements.map((achievement) => ({
        _id: achievement._id,
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
      })),
      recentActivity: recentActivity.map((activity) => ({
        _id: activity._id,
        type: activity.type,
        description: activity.description,
        createdAt: activity.createdAt,
      })),
      projects: projects.map((project) => ({
        _id: project._id,
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        url: project.url || "",
      })),
    };

    console.log("Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in student profile API:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
