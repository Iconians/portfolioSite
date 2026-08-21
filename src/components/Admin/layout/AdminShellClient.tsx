"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { AdminNav } from "@/components/Admin/layout/AdminNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminShellClientProps {
  userEmail?: string | null;
  logoutAction: () => Promise<void>;
  children: ReactNode;
}

export function AdminShellClient({
  userEmail,
  logoutAction,
  children,
}: AdminShellClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="admin-mobile-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(16rem,85vw)] flex-col border-r bg-background transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b px-3 py-3">
          <Link
            href="/admin"
            className="text-base font-bold"
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </Link>
        </div>

        <AdminNav
          className="flex-1 overflow-y-auto px-1"
          onNavigate={() => setMobileOpen(false)}
        />

        <div className="border-t p-3">
          {userEmail ? (
            <p className="mb-2 truncate text-xs text-muted-foreground">{userEmail}</p>
          ) : null}
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm" className="h-8 w-full text-xs">
              Logout
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b px-3 py-2 lg:hidden">
          <Link href="/admin" className="truncate text-base font-bold">
            Admin
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 px-2.5"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden />
            ) : (
              <Menu className="h-4 w-4" aria-hidden />
            )}
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </Button>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
