"use client";
import { Moon, Sun, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  useEffect(() => {
    console.log("ModeToggle - Current theme:", theme);
    console.log("ModeToggle - Resolved theme:", resolvedTheme);
    console.log(
      "ModeToggle - HTML theme:",
      document.documentElement.getAttribute("data-theme")
    );
  }, [theme, resolvedTheme]);

  const handleThemeChange = (newTheme: string) => {
    console.log("ModeToggle - Changing theme to:", newTheme);
    setTheme(newTheme);

    // Force update the theme attribute
    document.documentElement.setAttribute("data-theme", newTheme);

    // Add cosmic-mode class to body when in cosmic mode
    if (newTheme === "cosmic") {
      document.body.classList.add("cosmic-mode");
      document.body.style.backgroundColor = "transparent";
    } else {
      document.body.classList.remove("cosmic-mode");
      document.body.style.backgroundColor = "";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 cosmic:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 cosmic:scale-0" />
          <Stars className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all cosmic:rotate-0 cosmic:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("cosmic")}>
          <Stars className="mr-2 h-4 w-4" />
          <span>Cosmic</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
