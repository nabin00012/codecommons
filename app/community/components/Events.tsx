import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  tags: string[];
  organizer: {
    name: string;
    avatar?: string;
  };
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "React Workshop 2024",
    description:
      "Join us for an intensive workshop on React fundamentals and advanced concepts. Perfect for both beginners and intermediate developers.",
    date: new Date("2024-04-15T10:00:00"),
    location: "Room 101, Computer Science Building",
    tags: ["React", "Workshop", "Web Development"],
    organizer: {
      name: "Code Commons Team",
      avatar: "/avatars/team.jpg",
    },
  },
  // Add more mock events here
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <Button>Create Event</Button>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    Organized by {event.organizer.name}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {format(event.date, "MMM d, yyyy h:mm a")}
                </Badge>
              </div>

              <p className="text-gray-600">{event.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.location}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Register for Event
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
