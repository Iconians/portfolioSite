"use client";

import Link from "next/link";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

interface NavigationMobileProps {
  isOpen: boolean;
  mounted: boolean;
  links: { href: string; label: string }[];
  onClose: () => void;
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <span
      onClick={onClose}
      className="cursor-pointer p-2 text-muted-foreground transition-colors hover:text-primary"
      aria-label="Close menu"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
    >
      <X className="h-6 w-6" />
    </span>
  );
}

function DrawerContent({
  links,
  onClose,
}: {
  links: { href: string; label: string }[];
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-background p-6">
        <h2 className="text-lg font-semibold">Menu</h2>
        <CloseButton onClose={onClose} />
      </div>
      <div className="flex flex-col gap-6 bg-background p-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}

export function NavigationMobile({
  isOpen,
  mounted,
  links,
  onClose,
}: NavigationMobileProps) {
  if (!isOpen) {
    return null;
  }

  if (mounted && AnimatePresence && MotionDiv) {
    return (
      <AnimatePresence>
        <>
          <MotionDiv
            className="fixed inset-0 z-40 block bg-black dark:bg-black min-[469px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <MotionDiv
            className="fixed top-0 right-0 z-50 h-full w-64 border-l border-border bg-background shadow-xl max-[468px]:block min-[469px]:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <DrawerContent links={links} onClose={onClose} />
          </MotionDiv>
        </>
      </AnimatePresence>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 block bg-black dark:bg-black min-[469px]:hidden"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 z-50 h-full w-64 border-l border-border bg-background shadow-xl max-[468px]:block min-[469px]:hidden">
        <DrawerContent links={links} onClose={onClose} />
      </div>
    </>
  );
}
