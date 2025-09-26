"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  MessageCircle,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  tags: string[];
  votes: number;
  answers: any[];
  createdAt: string;
}

export default function CommunityPage() {
  const { user } = useUser();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch("/api/discussions", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setDiscussions(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDiscussion.title || !newDiscussion.content) {
      return;
    }

    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: newDiscussion.title,
          content: newDiscussion.content,
          tags: newDiscussion.tags.split(",").map(tag => tag.trim()).filter(Boolean),
          department: user?.department || "general",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(prev => [data.data, ...prev]);
        setNewDiscussion({ title: "", content: "", tags: "" });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
    }
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Community Discussions
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ask questions, share knowledge, and connect with your peers
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Discussion
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create Discussion Form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Start a New Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDiscussion} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Discussion title..."
                      value={newDiscussion.title}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg font-medium"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="What would you like to discuss?"
                      value={newDiscussion.content}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Tags (comma separated)"
                      value={newDiscussion.tags}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Post Discussion</Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Discussions List */}
        {filteredDiscussions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No discussions yet</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Be the first to start a discussion in your department!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {discussion.title}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {discussion.department.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    by {discussion.author} • {new Date(discussion.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {discussion.content}
                  </p>
                  
                  {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.votes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {discussion.answers.length}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}