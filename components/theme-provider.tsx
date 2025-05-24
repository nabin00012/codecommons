"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    console.log("ThemeProvider - Initializing");

    // Set up a MutationObserver to watch for changes to the data-theme attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme");
          console.log("ThemeProvider - Theme changed to:", newTheme);

          // Add cosmic-mode class to body when in cosmic mode
          if (newTheme === "cosmic") {
            document.body.classList.add("cosmic-mode");
            document.body.style.backgroundColor = "transparent";
          } else {
            document.body.classList.remove("cosmic-mode");
            document.body.style.backgroundColor = "";
          }
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
