"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Users2 } from "lucide-react";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function CommunityPage() {
  const router = useRouter();

  const features = [
    {
      title: "Discussions",
      description:
        "Join conversations about programming, technology, and learning. Ask questions, share knowledge, and connect with peers.",
      icon: MessageSquare,
      href: "/dashboard/community/discussions",
    },
    {
      title: "Events",
      description:
        "Discover and participate in workshops, hackathons, and tech meetups. Learn from experts and network with fellow developers.",
      icon: Calendar,
      href: "/dashboard/community/events",
    },
    {
      title: "Groups",
      description:
        "Find or create study groups and communities based on your interests. Collaborate on projects and learn together.",
      icon: Users2,
      href: "/dashboard/community/groups",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with peers, share knowledge, and grow together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(feature.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Button variant="outline" className="w-full">
                  Explore {feature.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
