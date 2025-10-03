import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Group } from "@/lib/models/group";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    let searchParams;
    try {
      const url = new URL(req.url);
      searchParams = url.searchParams;
    } catch (error) {
      console.error("Error parsing URL:", error);
      searchParams = new URLSearchParams();
    }
    
    const page = parseInt(searchParams?.get("page") || "1");
    const limit = parseInt(searchParams?.get("limit") || "10");
    const query = searchParams?.get("query") || "";
    const tags = searchParams?.get("tags")?.split(",") || [];

    await connectToDatabase();

    const filter: any = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const groups = await Group.find(filter)
      .sort({ memberCount: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("creator", "name avatar");

    const total = await Group.countDocuments(filter);

    return NextResponse.json({
      groups,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, tags } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const group = await Group.create({
      name,
      description,
      tags,
      creator: session.user.id,
      members: [session.user.id],
      memberCount: 1,
    });

    await group.populate("creator", "name avatar");

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
