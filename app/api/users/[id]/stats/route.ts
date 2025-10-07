import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    console.log("Fetching stats for user:", userId);

    const { db } = await connectToDatabase();

    // Fetch user's projects count
    const activeProjects = await db
      .collection("projects")
      .countDocuments({ ownerId: userId });

    // Fetch user's completed assignments count
    const assignmentsCompleted = await db
      .collection("submissions")
      .countDocuments({ userId, status: "completed" });

    // Fetch user's community posts count
    const communityPosts = await db
      .collection("discussions")
      .countDocuments({ authorId: userId });

    // Calculate current streak (simplified - you can make this more sophisticated)
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    const currentStreak = user?.streak || 0;

    // Calculate changes (you can implement actual comparison with previous period)
    const stats = {
      activeProjects,
      projectsChange: activeProjects > 0 ? `${activeProjects} active` : "No recent activity",
      assignmentsCompleted,
      assignmentsChange: assignmentsCompleted > 0 ? `${assignmentsCompleted} completed` : "No recent activity",
      communityPosts,
      postsChange: communityPosts > 0 ? `${communityPosts} posts` : "No recent activity",
      currentStreak,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
