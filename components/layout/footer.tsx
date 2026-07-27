import { APP_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-4 py-4 text-center text-xs text-zinc-500 sm:px-6 dark:border-zinc-800 dark:text-zinc-400">
      © {new Date().getFullYear()} {APP_NAME}
    </footer>
  );
}
