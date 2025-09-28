import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/lib/models/event";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await connectToDatabase();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const isAttending = event.attendees.includes(userId);

    if (isAttending) {
      // Remove from attendees
      event.attendees = event.attendees.filter(
        (attendee: any) => attendee.toString() !== userId
      );
    } else {
      // Add to attendees (check if event is full)
      if (event.attendees.length >= event.maxAttendees) {
        return NextResponse.json(
          { error: "Event is full" },
          { status: 400 }
        );
      }
      event.attendees.push(userId);
    }

    await event.save();

    return NextResponse.json({
      success: true,
      isAttending: !isAttending,
      attendeeCount: event.attendees.length,
    });
  } catch (error) {
    console.error("Error toggling attendance:", error);
    return NextResponse.json(
      { error: "Failed to toggle attendance" },
      { status: 500 }
    );
  }
}