"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NavigationMobile } from "./NavigationMobile";
import { navigationLinks } from "./navigationLinks";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/50 dark:bg-background/30 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex gap-8 py-2.5 md:py-3 items-center justify-between">
          {/* Desktop Menu */}
          <div className="hidden min-[469px]:flex gap-8">
            {navigationLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className="max-[468px]:flex min-[469px]:hidden items-center justify-center p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <NavigationMobile
        isOpen={isMobileMenuOpen}
        mounted={mounted}
        links={navigationLinks}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}
