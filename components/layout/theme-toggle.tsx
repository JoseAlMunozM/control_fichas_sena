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
      className="relative h-9 w-[4.5rem] rounded-full border border-zinc-200 bg-zinc-100 p-1 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-900"
      onClick={toggleTheme}
      title="Cambiar entre modo claro y oscuro"
      variant="ghost"
    >
      <span className="absolute left-1 top-1 size-7 rounded-full bg-white shadow-sm transition-transform duration-200 dark:translate-x-8 dark:bg-zinc-700" />
      <span className="relative z-10 grid size-7 place-items-center text-amber-500 transition-colors dark:text-zinc-500">
        <SunIcon className="size-4" />
      </span>
      <span className="relative z-10 grid size-7 place-items-center text-zinc-400 transition-colors dark:text-sky-300">
        <MoonIcon className="size-4" />
      </span>
    </Button>
  );
}
