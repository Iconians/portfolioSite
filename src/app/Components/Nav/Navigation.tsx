"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import framer-motion to prevent SSR issues during static generation
const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const pages = [
  { href: "/", label: "Home" },
  { href: "/About", label: "About" },
  { href: "/blogs", label: "Blogs" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex gap-8 py-4 items-center justify-between">
          {/* Desktop Menu */}
          <div className="hidden min-[469px]:flex gap-8">
            {pages.map(({ href, label }) => (
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

      {/* Mobile Menu Drawer */}
      {mounted && AnimatePresence && MotionDiv ? (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <MotionDiv
                className="fixed inset-0 bg-black dark:bg-black z-40 max-[468px]:block min-[469px]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <MotionDiv
                className="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 max-[468px]:block min-[469px]:hidden shadow-xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-border bg-background">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <span
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    aria-label="Close menu"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    <X className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex flex-col gap-6 p-6 bg-background">
                  {pages.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </MotionDiv>
            </>
          )}
        </AnimatePresence>
      ) : (
        // Fallback for SSR - render menu without animation
        isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black dark:bg-black z-40 max-[468px]:block min-[469px]:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 max-[468px]:block min-[469px]:hidden shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-border bg-background">
                <h2 className="text-lg font-semibold">Menu</h2>
                <span
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  aria-label="Close menu"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <X className="h-6 w-6" />
                </span>
              </div>
              <div className="flex flex-col gap-6 p-6 bg-background">
                {pages.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )
      )}
    </nav>
  );
}
