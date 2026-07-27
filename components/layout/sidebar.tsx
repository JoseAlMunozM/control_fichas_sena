"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAME } from "@/constants";
import type { NavigationMenu } from "@/types";
import { Button } from "@/components/ui";
import { cn, matchesRoute } from "@/utils";

import { CloseIcon } from "./icons";

export interface SidebarProps {
  isOpen: boolean;
  menus: readonly NavigationMenu[];
  onClose: () => void;
}

export function Sidebar({
  isOpen,
  menus,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Cerrar navegación"
        className={cn(
          "fixed inset-0 z-40 bg-zinc-950/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        type="button"
      />

      <aside
        aria-label="Navegación principal"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b border-zinc-200 px-5 dark:border-zinc-800">
          <Link
            className="flex min-w-0 items-center gap-3"
            href="/"
            onClick={onClose}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              CF
            </span>
            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {APP_NAME}
            </span>
          </Link>

          <Button
            aria-label="Cerrar navegación"
            className="size-9 shrink-0 px-0 lg:hidden dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={onClose}
            size="sm"
            variant="ghost"
          >
            <CloseIcon className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {menus.map((menu) => (
            <div key={menu.id}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {menu.label}
              </p>
              <ul className="space-y-1">
                {menu.items.map((item) => {
                  const isActive = matchesRoute(pathname, item);

                  return (
                    <li key={item.path}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
                        )}
                        href={item.path}
                        onClick={onClose}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-2 rounded-full",
                            isActive
                              ? "bg-emerald-600 dark:bg-emerald-400"
                              : "bg-zinc-300 dark:bg-zinc-700",
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
