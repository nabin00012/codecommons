"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  isDark: boolean;
  isLight: boolean;
  isCosmic: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("ThemeProvider - Theme changed:", resolvedTheme);
    if (resolvedTheme === "cosmic") {
      document.body.classList.add("cosmic-mode");
    } else {
      document.body.classList.remove("cosmic-mode");
    }
  }, [resolvedTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: theme || "system",
        setTheme,
        isDark: resolvedTheme === "dark",
        isLight: resolvedTheme === "light",
        isCosmic: resolvedTheme === "cosmic",
        isSystem: theme === "system",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
