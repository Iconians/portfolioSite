"use client";

import { Menu, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { Container } from "@/components/layout/Container";
import { Inline } from "@/components/layout/Stack";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

import { navigationLinks } from "./navigationLinks";
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
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/50 backdrop-blur-md dark:bg-background/30">
      <Container>
        <Inline className="items-center justify-between gap-8 py-2.5 md:py-3">
          <div className="hidden min-[469px]:flex gap-8">
            {navigationLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground no-underline hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="max-[468px]:flex min-[469px]:hidden"
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
      </Container>

      <NavigationMobile
        isOpen={isMobileMenuOpen}
        mounted={mounted}
        links={navigationLinks}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}
