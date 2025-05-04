"use client";

import { UserProvider } from "@/lib/context/user-context";
import { SettingsProvider } from "@/lib/context/settings-context";
import { HelpProvider } from "@/lib/context/help-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SettingsProvider>
        <HelpProvider>{children}</HelpProvider>
      </SettingsProvider>
    </UserProvider>
  );
}
