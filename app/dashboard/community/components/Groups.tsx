import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { groupService } from "@/lib/services/groupService";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activityLevel: "high" | "medium" | "low";
  tags: string[];
  isJoined?: boolean;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    activityLevel: "medium",
    tags: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupService.getAllGroups();
      setGroups(response.groups);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleJoin = async (groupId: string) => {
    try {
      await groupService.toggleJoin(groupId);
      await loadGroups(); // Reload groups to get updated membership
      toast({
        title: "Success",
        description: "Membership updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update membership",
        variant: "destructive",
      });
    }
  };

  const handleCreateGroup = async () => {
    try {
      await groupService.createGroup({
        name: newGroup.name,
        description: newGroup.description,
        activityLevel: newGroup.activityLevel as "high" | "medium" | "low",
        tags: newGroup.tags.split(",").map((tag) => tag.trim()),
      });

      await loadGroups();
      setIsCreating(false);
      setNewGroup({
        name: "",
        description: "",
        activityLevel: "medium",
        tags: "",
      });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading groups...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Groups</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>Create Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={newGroup.activityLevel}
                  onValueChange={(value) =>
                    setNewGroup({ ...newGroup, activityLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newGroup.tags}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, tags: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleCreateGroup} className="w-full">
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {group.memberCount} members
                  </p>
                </div>
                <Badge
                  variant={
                    group.activityLevel === "high"
                      ? "destructive"
                      : group.activityLevel === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {group.activityLevel} activity
                </Badge>
              </div>

              <p className="text-gray-600">{group.description}</p>

              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleToggleJoin(group.id)}
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
