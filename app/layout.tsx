import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/context/AuthContext";
import { UserProvider } from "@/lib/context/user-context";
import { SettingsProvider } from "@/lib/context/settings-context";
import { NotificationProvider } from "@/lib/context/notification-context";
import { ProjectProvider } from "@/lib/context/project-context";
import { ChatProvider } from "@/lib/context/chat-context";
import { HelpProvider } from "@/lib/context/help-context";
import { ThemeProvider as CustomThemeProvider } from "@/lib/context/theme-context";
import { Toaster } from "@/components/ui/toaster";
import { CosmicMode } from "@/components/cosmic-mode";
import { SessionProvider } from "@/components/providers/session-provider";
import "@/lib/monaco-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Commons",
  description: "A platform for collaborative coding and learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "cosmic"]}
          value={{
            light: "light",
            dark: "dark",
            cosmic: "cosmic",
          }}
          forcedTheme={undefined}
          disableTransitionOnChange={false}
        >
          <CustomThemeProvider>
            <AuthProvider>
              <UserProvider>
                <SettingsProvider>
                  <NotificationProvider>
                    <ProjectProvider>
                      <ChatProvider>
                        <HelpProvider>
                          <CosmicMode>
                            {children}
                            <Toaster />
                          </CosmicMode>
                        </HelpProvider>
                      </ChatProvider>
                    </ProjectProvider>
                  </NotificationProvider>
                </SettingsProvider>
              </UserProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
