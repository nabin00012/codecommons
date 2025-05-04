"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Settings {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    assignments: boolean;
    forum: boolean;
  };
  editor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  language: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: "system",
  notifications: {
    email: true,
    push: true,
    assignments: true,
    forum: true,
  },
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
  },
  language: "en",
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on initial render
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem("codecommons_settings");
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Error loading settings from localStorage:", error);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(
      "codecommons_settings",
      JSON.stringify(updatedSettings)
    );
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(
      "codecommons_settings",
      JSON.stringify(defaultSettings)
    );
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
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
