"use client";

import { THEME_STORAGE_KEY } from "@/constants";
import { Button } from "@/components/ui";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = !root.classList.contains("dark");

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  };

  return (
    <Button
      aria-label="Cambiar tema de color"
      className="size-10 px-0 dark:text-zinc-200 dark:hover:bg-zinc-800"
      onClick={toggleTheme}
      title="Cambiar tema de color"
      variant="ghost"
    >
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </Button>
  );
}
