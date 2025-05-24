"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, role: "user" | "assistant") => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    console.log("ChatProvider - Theme changed:", resolvedTheme);
  }, [resolvedTheme]);

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      role,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
