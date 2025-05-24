"use client";

import { createContext, useContext, useState } from "react";
import { useTheme } from "next-themes";

interface HelpTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  updatedAt: string;
}

interface HelpContextType {
  tickets: HelpTicket[];
  createTicket: (title: string, description: string) => void;
  updateTicket: (id: string, updates: Partial<HelpTicket>) => void;
  deleteTicket: (id: string) => void;
  getTicket: (id: string) => HelpTicket | undefined;
  searchTickets: (query: string) => HelpTicket[];
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const { resolvedTheme } = useTheme();

  const createTicket = (title: string, description: string) => {
    const newTicket: HelpTicket = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [...prev, newTicket]);
  };

  const updateTicket = (id: string, updates: Partial<HelpTicket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  const getTicket = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };

  const searchTickets = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(lowerQuery) ||
        ticket.description.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <HelpContext.Provider
      value={{
        tickets,
        createTicket,
        updateTicket,
        deleteTicket,
        getTicket,
        searchTickets,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error("useHelp must be used within a HelpProvider");
  }
  return context;
}
