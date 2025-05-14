"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiscussionsPage() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Discussions page! This is a placeholder. You can add
            threads, comments, or any discussion features here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
