import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Discussion {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    department: string;
    avatar?: string;
  };
  tags: string[];
  likes: number;
  comments: number;
  createdAt: Date;
}

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    title: "Best resources to learn React hooks?",
    description:
      "I'm looking for good resources to learn React hooks in depth. Any recommendations for tutorials, courses, or books that helped you understand hooks well?",
    author: {
      name: "Rahul Singh",
      department: "Computer Science",
      avatar: "/avatars/rahul.jpg",
    },
    tags: ["React", "JavaScript", "Web Development"],
    likes: 24,
    comments: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  // Add more mock discussions here
];

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
        <Button>Start Discussion</Button>
      </div>

      <div className="grid gap-6">
        {discussions.map((discussion) => (
          <Card
            key={discussion.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={discussion.author.avatar} />
                <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {discussion.author.name}
                  </span>
                  <span>•</span>
                  <span>{discussion.author.department}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(discussion.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{discussion.title}</h3>
                <p className="text-gray-600">{discussion.description}</p>

                <div className="flex flex-wrap gap-2">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{discussion.likes} likes</span>
                  <span>{discussion.comments} comments</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
