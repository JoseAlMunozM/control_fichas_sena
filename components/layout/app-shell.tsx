"use client";

import { useState, type ReactNode } from "react";

import {
  NAVIGATION_MENUS,
  ROUTE_CONFIG,
} from "@/constants";
import type {
  AppRouteConfig,
  NavigationMenuConfig,
  UserRole,
} from "@/types";
import { createNavigationMenus } from "@/utils";

import { Breadcrumb } from "./breadcrumb";
import { Footer } from "./footer";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export interface AppShellProps {
  children: ReactNode;
  currentUserName?: string | null;
  currentUserRole?: UserRole;
  menuConfig?: readonly NavigationMenuConfig[];
  routes?: readonly AppRouteConfig[];
}

export function AppShell({
  children,
  currentUserName,
  currentUserRole,
  menuConfig = NAVIGATION_MENUS,
  routes = ROUTE_CONFIG,
}: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUserRole) {
    return <div className="min-h-screen">{children}</div>;
  }

  const navigationMenus = createNavigationMenus(
    routes,
    menuConfig,
    currentUserRole,
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <a
        className="fixed left-4 top-4 z-[60] -translate-y-20 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Saltar al contenido
      </a>

      <Sidebar
        isOpen={isSidebarOpen}
        menus={navigationMenus}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <Header
          currentUserName={currentUserName}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex flex-1 flex-col">
          <main
            className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 sm:px-6 lg:px-8"
            id="main-content"
          >
            <Breadcrumb routes={routes} />
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
