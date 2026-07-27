"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTE_CONFIG } from "@/constants";
import type { AppRouteConfig } from "@/types";

import { ChevronRightIcon } from "./icons";

export interface BreadcrumbProps {
  labels?: Readonly<Record<string, string>>;
  routes?: readonly AppRouteConfig[];
}

function formatSegment(segment: string) {
  let decodedSegment = segment;

  try {
    decodedSegment = decodeURIComponent(segment);
  } catch {
    decodedSegment = segment;
  }

  const label = decodedSegment.replaceAll("-", " ").replaceAll("_", " ");

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function Breadcrumb({
  labels = {},
  routes = ROUTE_CONFIG,
}: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const homeLabel =
    routes.find((route) => route.path === "/")?.label ?? "Inicio";

  return (
    <nav aria-label="Migas de pan" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
        <li>
          {segments.length === 0 ? (
            <span aria-current="page" className="font-medium text-zinc-900 dark:text-zinc-100">
              {homeLabel}
            </span>
          ) : (
            <Link
              className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
              href="/"
            >
              {homeLabel}
            </Link>
          )}
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const configuredLabel = routes.find(
            (route) => route.path === href,
          )?.label;
          const label =
            labels[segment] ??
            configuredLabel ??
            formatSegment(segment);

          return (
            <li className="flex items-center gap-1" key={href}>
              <ChevronRightIcon className="size-4 shrink-0" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {label}
                </span>
              ) : (
                <Link
                  className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
                  href={href}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
