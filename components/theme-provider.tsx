"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
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
