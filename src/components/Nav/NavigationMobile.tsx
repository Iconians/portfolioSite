import { X } from "lucide-react";
import dynamic from "next/dynamic";

import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false },
);

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

interface NavigationMobileProps {
  isOpen: boolean;
  mounted: boolean;
  links: readonly { href: string; label: string }[];
  contactHref: string;
  onClose: () => void;
}

function DrawerContent({
  links,
  contactHref,
  onClose,
}: {
  links: readonly { href: string; label: string }[];
  contactHref: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-background p-6">
        <Heading level={4} className="text-lg">
          Menu
        </Heading>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <Stack gap="md" className="bg-background p-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="text-base font-medium text-muted-foreground no-underline hover:text-ds-accent-hover"
          >
            {label}
          </Link>
        ))}
        <Button asChild className="mt-2 w-full">
          <Link
            href={contactHref}
            external
            onClick={onClose}
            className="no-underline hover:no-underline"
          >
            Get in touch
          </Link>
        </Button>
      </Stack>
    </>
  );
}

export function NavigationMobile({
  isOpen,
  mounted,
  links,
  contactHref,
  onClose,
}: NavigationMobileProps) {
  const reducedMotion = useReducedMotion();

  if (!isOpen) {
    return null;
  }

  if (!reducedMotion && mounted && AnimatePresence && MotionDiv) {
    return (
      <AnimatePresence>
        <>
          <MotionDiv
            className="fixed inset-0 z-40 block bg-black min-[769px]:hidden dark:bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <MotionDiv
            className="fixed top-0 right-0 z-50 h-full w-64 border-l border-border bg-background shadow-xl max-[768px]:block min-[769px]:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <DrawerContent
              links={links}
              contactHref={contactHref}
              onClose={onClose}
            />
          </MotionDiv>
        </>
      </AnimatePresence>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 block bg-black min-[769px]:hidden dark:bg-black"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 z-50 h-full w-64 border-l border-border bg-background shadow-xl max-[768px]:block min-[769px]:hidden">
        <DrawerContent
          links={links}
          contactHref={contactHref}
          onClose={onClose}
        />
      </div>
    </>
  );
}
