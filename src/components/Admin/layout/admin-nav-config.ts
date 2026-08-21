export interface AdminNavItem {
  label: string;
  href: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Portfolio", href: "/admin/portfolio" },
  { label: "Media", href: "/admin/media" },
  { label: "Articles", href: "/admin/articles" },
  { label: "Reviews", href: "/admin/reviews" },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
