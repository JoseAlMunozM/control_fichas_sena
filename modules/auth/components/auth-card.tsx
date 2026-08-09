import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/layout";
import { APP_NAME } from "@/constants";

export interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  children,
  description,
  title,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {APP_NAME}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
          <ThemeToggle />
        </div>
        {children}
      </section>
    </main>
  );
}
