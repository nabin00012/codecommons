"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

export interface Settings {
  theme: string;
  notifications: boolean;
  language: string;
  editor: {
    theme: string;
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
  };
  sound: boolean;
  enabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  theme: "system",
  notifications: true,
  language: "en",
  editor: {
    theme: "vs-dark",
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
  },
  sound: true,
  enabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    console.log("SettingsProvider - Theme changed:", resolvedTheme);
    if (settings.theme !== resolvedTheme) {
      setTheme(settings.theme);
    }
  }, [resolvedTheme, settings.theme, setTheme]);

  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("settings", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
