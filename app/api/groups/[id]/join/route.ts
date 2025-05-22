import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Group } from "@/lib/models/Group";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const group = await Group.findById(params.id);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const isMember = group.members.includes(userId);

    if (isMember) {
      // Remove user from members
      group.members = group.members.filter((id) => id.toString() !== userId);
      group.memberCount = Math.max(0, group.memberCount - 1);
    } else {
      // Add user to members
      group.members.push(userId);
      group.memberCount += 1;
    }

    await group.save();

    return NextResponse.json({
      isMember: !isMember,
      memberCount: group.memberCount,
    });
  } catch (error) {
    console.error("Error toggling group membership:", error);
    return NextResponse.json(
      { error: "Failed to toggle membership" },
      { status: 500 }
    );
  }
}
