export interface Settings {
  theme: "light" | "dark" | "system" | "cosmic";
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  language: string;
  editor: {
    fontSize: number;
    theme: string;
    lineNumbers: boolean;
    minimap: boolean;
  };
  enabled: boolean;
}

export const defaultSettings: Settings = {
  theme: "system",
  notifications: {
    enabled: true,
    email: true,
    push: true,
    sound: true,
  },
  language: "en",
  editor: {
    fontSize: 14,
    theme: "vs-dark",
    lineNumbers: true,
    minimap: true,
  },
  enabled: true,
};
