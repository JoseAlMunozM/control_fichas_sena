import { APP_NAME } from "@/constants";
import { Button } from "@/components/ui";
import { logoutAction } from "@/modules/auth/actions";

import { MenuIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export interface HeaderProps {
  currentUserName?: string | null;
  onOpenSidebar: () => void;
  title?: string;
}

export function Header({
  currentUserName,
  onOpenSidebar,
  title = APP_NAME,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          aria-label="Abrir navegación"
          className="size-10 shrink-0 px-0 lg:hidden dark:text-zinc-200 dark:hover:bg-zinc-800"
          onClick={onOpenSidebar}
          variant="ghost"
        >
          <MenuIcon className="size-5" />
        </Button>
        <p className="truncate text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-100">
          {title}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {currentUserName ? (
          <span className="hidden max-w-48 truncate text-sm text-zinc-600 sm:block dark:text-zinc-300">
            {currentUserName}
          </span>
        ) : null}
        <ThemeToggle />
        <form action={logoutAction}>
          <Button size="sm" type="submit" variant="ghost">
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}
