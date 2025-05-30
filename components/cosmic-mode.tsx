"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const CosmicBackground = dynamic(
  () =>
    import("@/components/cosmic-background").then(
      (mod) => mod.CosmicBackground
    ),
  { ssr: false }
);

export function CosmicMode({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (resolvedTheme === "cosmic") {
      document.body.classList.add("cosmic-mode");
      document.body.style.backgroundColor = "transparent";
    } else {
      document.body.classList.remove("cosmic-mode");
      document.body.style.backgroundColor = "";
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="relative min-h-screen">
      {resolvedTheme === "cosmic" && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <CosmicBackground />
        </div>
      )}
      <div className="relative z-10 min-h-screen bg-background/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
