import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { discussionService } from "@/lib/services/discussionService";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    department: string;
    avatar?: string;
  };
  tags: string[];
  likes: string[];
  comments: {
    content: string;
    author: {
      name: string;
      department: string;
      avatar?: string;
    };
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      const response = await discussionService.getAllDiscussions();
      setDiscussions(response.discussions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (discussionId: string) => {
    try {
      await discussionService.toggleLike(discussionId);
      await loadDiscussions(); // Reload discussions to get updated likes
      toast({
        title: "Success",
        description: "Like updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleCreateDiscussion = async () => {
    try {
      await discussionService.createDiscussion({
        title: newDiscussion.title,
        content: newDiscussion.content,
        tags: newDiscussion.tags.split(",").map((tag) => tag.trim()),
      });

      await loadDiscussions();
      setIsCreating(false);
      setNewDiscussion({
        title: "",
        content: "",
        tags: "",
      });
      toast({
        title: "Success",
        description: "Discussion created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading discussions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussions</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>Start Discussion</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      content: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newDiscussion.tags}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, tags: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleCreateDiscussion} className="w-full">
                Create Discussion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {discussions.map((discussion) => (
          <Card
            key={discussion.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{discussion.title}</h3>
                  <p className="text-sm text-gray-500">
                    Posted by {discussion.author.name} •{" "}
                    {format(new Date(discussion.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {discussion.comments.length} comments
                </Badge>
              </div>

              <p className="text-gray-600">{discussion.content}</p>

              <div className="flex flex-wrap gap-2">
                {discussion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleLike(discussion.id)}
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      discussion.likes.length > 0
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{discussion.likes.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Comment</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
