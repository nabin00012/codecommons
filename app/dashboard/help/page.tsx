"use client";

import { useHelp } from "@/lib/context/help-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const { tickets, createTicket, searchTickets } = useHelp();
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
  });

  const filteredTickets = searchQuery ? searchTickets(searchQuery) : tickets;

  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.description) {
      createTicket(newTicket.title, newTicket.description);
      setNewTicket({ title: "", description: "" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-muted-foreground">
                Get assistance with any issues
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Create New Ticket */}
          <div className="md:col-span-4">
            <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create New Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Ticket Title"
                      value={newTicket.title}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, title: e.target.value })
                      }
                      className="bg-background/50 backdrop-blur-sm border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe your issue..."
                      value={newTicket.description}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          description: e.target.value,
                        })
                      }
                      className="bg-background/50 backdrop-blur-sm border-primary/20 min-h-[100px]"
                    />
                  </div>
                  <Button
                    className="w-full gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                    onClick={handleCreateTicket}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Submit Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <div className="md:col-span-8">
            <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader className="border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Your Tickets
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 bg-background/50 backdrop-blur-sm border-primary/20"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No tickets found
                    </div>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-primary/10"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {ticket.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            <span className="text-sm capitalize">
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Created:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
