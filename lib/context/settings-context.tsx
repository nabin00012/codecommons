"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface EditorSettings {
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
}

interface Settings {
  theme: "light" | "dark" | "system" | "cosmic";
  editor: EditorSettings;
  notifications: NotificationSettings;
}

const defaultSettings: Settings = {
  theme: "system",
  editor: {
    theme: "vs-dark",
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: false,
  },
  notifications: {
    enabled: true,
    email: true,
    push: true,
    sound: true,
  },
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize settings from localStorage after mounting
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.error("Failed to parse saved settings:", error);
        }
      }
    }
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== "undefined") {
        localStorage.setItem("settings", JSON.stringify(updated));
      }
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
