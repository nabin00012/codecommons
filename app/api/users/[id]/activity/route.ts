import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { db } = await connectToDatabase();

    // Fetch recent activities from different collections
    const activity: any[] = [];

    // Get recent projects
    const recentProjects = await db
      .collection("projects")
      .find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    recentProjects.forEach((project) => {
      activity.push({
        id: project._id.toString(),
        title: `Created project: ${project.title}`,
        type: "project",
        time: getTimeAgo(project.createdAt),
      });
    });

    // Get recent submissions
    const recentSubmissions = await db
      .collection("submissions")
      .find({ userId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .toArray();

    recentSubmissions.forEach((submission) => {
      activity.push({
        id: submission._id.toString(),
        title: "Completed Assignment",
        type: "assignment",
        time: getTimeAgo(submission.submittedAt),
      });
    });

    // Get recent classroom joins
    const recentClassrooms = await db
      .collection("classrooms")
      .find({ "students.userId": userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    recentClassrooms.forEach((classroom) => {
      activity.push({
        id: classroom._id.toString(),
        title: `Joined ${classroom.name} Classroom`,
        type: "classroom",
        time: getTimeAgo(classroom.createdAt),
      });
    });

    // Sort by most recent
    activity.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });

    return NextResponse.json({
      success: true,
      activity: activity.slice(0, 10),
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function parseTimeAgo(timeStr: string): number {
  if (timeStr === "just now") return 0;
  const match = timeStr.match(/(\d+)([mhd])/);
  if (!match) return 0;
  const value = parseInt(match[1]);
  const unit = match[2];
  if (unit === "m") return value;
  if (unit === "h") return value * 60;
  if (unit === "d") return value * 60 * 24;
  return 0;
}
