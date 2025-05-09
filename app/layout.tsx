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
import "@/lib/monaco-config";
import { AuthProvider } from "@/lib/context/AuthContext";

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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <UserProvider>
              <SettingsProvider>
                <HelpProvider>
                  {children}
                  <Toaster />
                  <CosmicMode />
                </HelpProvider>
              </SettingsProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
