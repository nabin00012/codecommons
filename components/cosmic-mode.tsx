"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CosmicBackground } from "./cosmic-background";

export function CosmicMode({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {resolvedTheme === "cosmic" && <CosmicBackground />}
      {children}
    </>
  );
}
