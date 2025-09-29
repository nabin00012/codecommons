"use client";

import { AuthProvider } from "@/lib/context/AuthContext";
import { UserProvider } from "@/lib/context/user-context";
import { SettingsProvider } from "@/lib/context/settings-context";
import { NotificationProvider } from "@/lib/context/notification-context";
import { ProjectProvider } from "@/lib/context/project-context";
import { ChatProvider } from "@/lib/context/chat-context";
import { HelpProvider } from "@/lib/context/help-context";
import { ThemeProvider } from "@/components/theme-provider";
import { CosmicMode } from "@/components/cosmic-mode";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextAuthProvider>
        <AuthProvider>
          <UserProvider>
            <SettingsProvider>
              <NotificationProvider>
                <ProjectProvider>
                  <ChatProvider>
                    <HelpProvider>
                      <CosmicMode>{children}</CosmicMode>
                    </HelpProvider>
                  </ChatProvider>
                </ProjectProvider>
              </NotificationProvider>
            </SettingsProvider>
          </UserProvider>
        </AuthProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
}
