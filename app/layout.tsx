import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/lib/context/user-context";
import { SettingsProvider } from "@/lib/context/settings-context";
import { HelpProvider } from "@/lib/context/help-context";
import { Toaster } from "@/components/ui/toaster";
import { CosmicMode } from "@/components/cosmic-mode";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeCommons - Jain University Q&A Platform",
  description:
    "A collaborative platform for students and teachers to ask and answer coding questions.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background antialiased"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            <SettingsProvider>
              <HelpProvider>
                <CosmicMode>{children}</CosmicMode>
                <Toaster />
              </HelpProvider>
            </SettingsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
