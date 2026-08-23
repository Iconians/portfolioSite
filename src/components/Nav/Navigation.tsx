"use client";

import { Menu, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { Container } from "@/components/layout/Container";
import { Inline } from "@/components/layout/Stack";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

import { CONTACT_HREF, navigationLinks } from "./navigationLinks";
import { NavigationMobile } from "./NavigationMobile";

const emptySubscribe = () => () => {};

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md dark:bg-background/60">
      <Container>
        <Inline className="items-center justify-between gap-4 py-2.5 md:py-3">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-foreground no-underline hover:text-ds-accent-hover md:text-base"
          >
            <span className="text-ds-accent">&gt;</span> Clayton Cripe
          </Link>

          <div className="hidden min-[769px]:flex flex-1 items-center justify-center gap-8">
            {navigationLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground no-underline hover:text-ds-accent-hover"
              >
                {label}
              </Link>
            ))}
          </div>

          <Inline className="items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden min-[769px]:inline-flex"
            >
              <Link
                href={CONTACT_HREF}
                external
                className="no-underline hover:no-underline"
              >
                Get in touch
              </Link>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="max-[768px]:flex min-[769px]:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </Inline>
        </Inline>
      </Container>

      <NavigationMobile
        isOpen={isMobileMenuOpen}
        mounted={mounted}
        links={navigationLinks}
        contactHref={CONTACT_HREF}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}
