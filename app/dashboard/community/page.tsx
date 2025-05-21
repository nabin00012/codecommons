"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Discussions from "./components/Discussions";
import Events from "./components/Events";
import Groups from "./components/Groups";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Community</h1>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions">
            <Discussions />
          </TabsContent>

          <TabsContent value="events">
            <Events />
          </TabsContent>

          <TabsContent value="groups">
            <Groups />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
