"use client";

import { THEME_STORAGE_KEY } from "@/constants";
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
    <button
      aria-label="Cambiar tema de color"
      className="relative inline-grid h-9 w-[4.25rem] shrink-0 grid-cols-2 items-center rounded-full border border-zinc-200 bg-zinc-100 p-1 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      onClick={toggleTheme}
      title="Cambiar entre modo claro y oscuro"
      type="button"
    >
      <span className="absolute left-1 top-1 size-7 rounded-full bg-white shadow-sm transition-transform duration-200 dark:translate-x-8 dark:bg-zinc-700" />
      <span className="relative z-10 grid place-items-center text-amber-500 transition-colors dark:text-zinc-500">
        <SunIcon className="size-4" />
      </span>
      <span className="relative z-10 grid place-items-center text-zinc-400 transition-colors dark:text-sky-300">
        <MoonIcon className="size-4" />
      </span>
    </button>
  );
}
