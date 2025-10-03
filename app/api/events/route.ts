import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/lib/models/event";
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
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("organizer", "name avatar");

    const total = await Event.countDocuments(filter);

    return NextResponse.json({
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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

    const { title, description, date, location, tags, maxAttendees } =
      await req.json();

    if (!title || !description || !date || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      tags,
      maxAttendees,
      organizer: session.user.id,
      attendees: [],
    });

    await event.populate("organizer", "name avatar");

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
