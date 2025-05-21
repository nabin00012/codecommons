import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activityLevel: "High" | "Medium" | "Low";
  tags: string[];
  isJoined?: boolean;
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Web Development Club",
    description:
      "A community of web developers sharing knowledge and building projects together.",
    memberCount: 124,
    activityLevel: "High",
    tags: ["JavaScript", "React", "CSS"],
    isJoined: false,
  },
  // Add more mock groups here
];

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);

  const handleJoinGroup = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, isJoined: !group.isJoined } : group
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Groups</h2>
        <Button>Create Group</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{group.name}</h3>
                <Badge
                  variant={
                    group.activityLevel === "High" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {group.activityLevel} Activity
                </Badge>
              </div>

              <p className="text-gray-600">{group.description}</p>

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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{group.memberCount} members</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                variant={group.isJoined ? "outline" : "default"}
                className="w-full"
                onClick={() => handleJoinGroup(group.id)}
              >
                {group.isJoined ? "Leave Group" : "Join Group"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
