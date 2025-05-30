import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
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
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <Providers>
          <main className="relative flex min-h-screen flex-col overflow-x-hidden">
            <div className="flex-1">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
