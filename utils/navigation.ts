import type {
  AppRouteConfig,
  NavigationMenu,
  NavigationMenuConfig,
  UserRole,
} from "@/types";

export function matchesRoute(
  pathname: string,
  route: AppRouteConfig,
): boolean {
  if (route.exact || route.path === "/") {
    return pathname === route.path;
  }

  return (
    pathname === route.path ||
    pathname.startsWith(`${route.path}/`)
  );
}

export function findRouteConfig(
  pathname: string,
  routes: readonly AppRouteConfig[],
): AppRouteConfig | undefined {
  return routes
    .filter((route) => matchesRoute(pathname, route))
    .sort(
      (firstRoute, secondRoute) =>
        secondRoute.path.length - firstRoute.path.length,
    )[0];
}

export function createNavigationMenus(
  routes: readonly AppRouteConfig[],
  menuConfig: readonly NavigationMenuConfig[],
  userRole?: UserRole,
): NavigationMenu[] {
  return [...menuConfig]
    .sort((firstMenu, secondMenu) => firstMenu.order - secondMenu.order)
    .map((menu) => {
      const items = routes
        .filter((route) => {
          if (route.navigation?.menuId !== menu.id) {
            return false;
          }

          return (
            !route.roles ||
            (userRole !== undefined && route.roles.includes(userRole))
          );
        })
        .sort(
          (firstRoute, secondRoute) =>
            (firstRoute.navigation?.order ?? 0) -
            (secondRoute.navigation?.order ?? 0),
        );

      return {
        id: menu.id,
        label: menu.label,
        items,
      };
    })
    .filter((menu) => menu.items.length > 0);
}
