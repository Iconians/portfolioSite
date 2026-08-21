"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/Admin/layout/AdminNav";
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
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b px-4 py-4">
          <Link
            href="/admin"
            className="text-lg font-bold"
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </Link>
        </div>

        <AdminNav
          className="flex-1 overflow-y-auto"
          onNavigate={() => setMobileOpen(false)}
        />

        <div className="border-t p-4">
          {userEmail ? (
            <p className="mb-3 truncate text-xs text-muted-foreground">{userEmail}</p>
          ) : null}
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Logout
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3 lg:hidden">
          <Link href="/admin" className="text-lg font-bold">
            Admin
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            Menu
          </Button>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
