"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CosmicBackground } from "./cosmic-background";

export function CosmicMode({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  useEffect(() => {
    console.log("CosmicMode - Component mounted");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log("CosmicMode - Theme changed:", {
      theme,
      resolvedTheme,
      htmlTheme: document.documentElement.getAttribute("data-theme"),
    });

    // Force update the theme
    document.documentElement.setAttribute(
      "data-theme",
      resolvedTheme || "light"
    );

    // Add cosmic-mode class to body when in cosmic mode
    if (resolvedTheme === "cosmic") {
      document.body.classList.add("cosmic-mode");
      document.body.style.backgroundColor = "transparent";
    } else {
      document.body.classList.remove("cosmic-mode");
      document.body.style.backgroundColor = "";
    }
  }, [theme, resolvedTheme, mounted]);

  // Don't render anything during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  const isCosmic = resolvedTheme === "cosmic";
  console.log("CosmicMode - Rendering with cosmic:", isCosmic);

  return (
    <div
      data-theme={resolvedTheme}
      className={`theme-container ${isCosmic ? "cosmic-mode" : ""}`}
    >
      {isCosmic && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <CosmicBackground />
        </div>
      )}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
