export interface Settings {
  theme: string;
  notifications: boolean;
  language: string;
  editor: {
    fontSize: number;
    theme: string;
    lineNumbers: boolean;
    minimap: boolean;
  };
  sound: boolean;
  enabled: boolean;
}

export const defaultSettings: Settings = {
  theme: "system",
  notifications: true,
  language: "en",
  editor: {
    fontSize: 14,
    theme: "vs-dark",
    lineNumbers: true,
    minimap: true,
  },
  sound: true,
  enabled: true,
};
