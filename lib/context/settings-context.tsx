"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface Settings {
  theme: string;
  language: string;
  notifications: boolean;
  sound: boolean;
  fontSize: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: "system",
  language: "en",
  notifications: true,
  sound: true,
  fontSize: 16,
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
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings((prev) => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error("Failed to parse stored settings:", error);
      }
    }
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("settings");
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
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
