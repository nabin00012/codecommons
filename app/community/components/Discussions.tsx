import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
}

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await discussionService.getAllDiscussions();
      setDiscussions(response.discussions);
      setError(null);
    } catch (err) {
      setError("Failed to fetch discussions");
      toast({
        title: "Error",
        description: "Failed to fetch discussions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const tags = newDiscussion.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await discussionService.createDiscussion({
        title: newDiscussion.title,
        content: newDiscussion.content,
        tags,
      });

      setDiscussions([response, ...discussions]);
      setIsCreateDialogOpen(false);
      setNewDiscussion({ title: "", content: "", tags: "" });
      toast({
        title: "Success",
        description: "Discussion created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (discussionId: string) => {
    try {
      await discussionService.toggleLike(discussionId);
      fetchDiscussions(); // Refresh to get updated likes
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Start Discussion</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Discussion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDiscussion} className="space-y-4">
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
                  required
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
                  required
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
                  placeholder="e.g., React, JavaScript, Web Development"
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Discussion"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                    {formatDistanceToNow(new Date(discussion.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{discussion.title}</h3>
                <p className="text-gray-600">{discussion.content}</p>

                <div className="flex flex-wrap gap-2">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(discussion.id)}
                  >
                    {discussion.likes.length} likes
                  </Button>
                  <span>{discussion.comments.length} comments</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
