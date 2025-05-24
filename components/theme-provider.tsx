"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    console.log("ThemeProvider - Initializing");

    // Force a re-render when the theme changes
    const root = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const newTheme = root.getAttribute("data-theme");
          console.log("ThemeProvider - Theme changed to:", newTheme);

          // Force update classes
          if (newTheme === "cosmic") {
            document.body.classList.add("cosmic-mode");
          } else {
            document.body.classList.remove("cosmic-mode");
          }
        }
      });
    });

    observer.observe(root, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      themes={["light", "dark", "cosmic"]}
      value={{
        light: "light",
        dark: "dark",
        cosmic: "cosmic",
        system: "system",
      }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
