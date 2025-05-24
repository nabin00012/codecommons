"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    console.log("CosmicMode - Theme changed:", resolvedTheme);
    if (resolvedTheme === "cosmic") {
      document.documentElement.setAttribute("data-theme", "cosmic");
      document.body.classList.add("cosmic-mode");
      document.body.style.backgroundColor = "transparent";
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        resolvedTheme || "light"
      );
      document.body.classList.remove("cosmic-mode");
      document.body.style.backgroundColor = "";
    }
  }, [resolvedTheme]);

  return (
    <div className="relative min-h-screen">
      {resolvedTheme === "cosmic" && (
        <div className="fixed inset-0 pointer-events-none">
          <CosmicBackground />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
