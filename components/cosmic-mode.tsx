"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CosmicBackground } from "./cosmic-background";

export function CosmicMode({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("CosmicMode - Theme:", theme);
    console.log("CosmicMode - Resolved Theme:", resolvedTheme);

    // Update the document's data-theme attribute
    if (mounted) {
      document.documentElement.setAttribute(
        "data-theme",
        resolvedTheme || "light"
      );
    }
  }, [theme, resolvedTheme, mounted]);

  // Don't render anything during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  const isCosmic = resolvedTheme === "cosmic";
  console.log("Is cosmic mode:", isCosmic);

  return (
    <div data-theme={resolvedTheme}>
      {isCosmic && <CosmicBackground />}
      {children}
    </div>
  );
}
