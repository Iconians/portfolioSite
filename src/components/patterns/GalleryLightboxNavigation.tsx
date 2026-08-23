import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { getAdjacentGalleryIndex } from "@/components/patterns/engineering-gallery-navigation";
import { Button } from "@/components/ui/button";

interface GalleryLightboxNavigationProps {
  currentIndex: number;
  total: number;
  onNavigate: (index: number) => void;
}

export function GalleryLightboxNavigation({
  currentIndex,
  total,
  onNavigate,
}: GalleryLightboxNavigationProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 pt-0.5">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Previous image"
        disabled={!hasPrev}
        onClick={() =>
          onNavigate(getAdjacentGalleryIndex(currentIndex, "prev", total))
        }
      >
        <ChevronLeftIcon />
      </Button>

      <p
        className="text-xs text-muted-foreground tabular-nums sm:text-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentIndex + 1} / {total}
      </p>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Next image"
        disabled={!hasNext}
        onClick={() =>
          onNavigate(getAdjacentGalleryIndex(currentIndex, "next", total))
        }
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
