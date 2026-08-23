"use client";

import { useCallback, useState, type KeyboardEvent } from "react";

import { getAdjacentGalleryIndex } from "@/components/patterns/engineering-gallery-navigation";
import {
  DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE,
  isGalleryLightboxActualSize,
  type GalleryLightboxViewMode,
} from "@/components/patterns/gallery-lightbox-view";
import { GalleryLightboxHeader } from "@/components/patterns/GalleryLightboxHeader";
import { GalleryLightboxImageViewport } from "@/components/patterns/GalleryLightboxImageViewport";
import { GalleryLightboxNavigation } from "@/components/patterns/GalleryLightboxNavigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { GalleryImage } from "@/design-system/types/gallery";

interface GalleryLightboxProps {
  images: GalleryImage[];
  openIndex: number | null;
  onOpenIndexChange: (index: number | null) => void;
}

function resetViewModeForOpenIndex(
  openIndex: number | null,
  prevOpenIndex: number | null,
  setViewMode: (mode: GalleryLightboxViewMode) => void
): void {
  if (openIndex !== prevOpenIndex && openIndex !== null) {
    setViewMode(DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE);
  }
}

export function GalleryLightbox({
  images,
  openIndex,
  onOpenIndexChange,
}: GalleryLightboxProps) {
  const [viewMode, setViewMode] = useState<GalleryLightboxViewMode>(
    DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE
  );
  const [trackedOpenIndex, setTrackedOpenIndex] = useState(openIndex);

  if (openIndex !== trackedOpenIndex) {
    setTrackedOpenIndex(openIndex);
    resetViewModeForOpenIndex(openIndex, trackedOpenIndex, setViewMode);
  }

  const isOpen = openIndex !== null;
  const currentIndex = openIndex ?? 0;
  const current = images[currentIndex];
  const total = images.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;

  const navigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) {
        setViewMode(DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE);
        onOpenIndexChange(index);
      }
    },
    [onOpenIndexChange, total]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) {
        return;
      }

      if (event.key === "ArrowLeft" && hasPrev) {
        event.preventDefault();
        navigate(getAdjacentGalleryIndex(currentIndex, "prev", total));
      }

      if (event.key === "ArrowRight" && hasNext) {
        event.preventDefault();
        navigate(getAdjacentGalleryIndex(currentIndex, "next", total));
      }
    },
    [currentIndex, hasNext, hasPrev, isOpen, navigate, total]
  );

  if (!current) {
    return null;
  }

  const captionId = current.caption ? "gallery-lightbox-caption" : undefined;
  const isActualSize = isGalleryLightboxActualSize(viewMode);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onOpenIndexChange(null);
          setViewMode(DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE);
        }
      }}
    >
      <DialogContent
        className={cn(
          "flex w-[min(95vw,100vw)] max-w-[95vw] flex-col gap-2 border-border/60 py-2 pl-2 pr-12 sm:gap-2 sm:py-3 sm:pl-3 sm:pr-14",
          isActualSize
            ? "h-[min(90dvh,90vh)]"
            : "h-auto max-h-[min(90dvh,90vh)]"
        )}
        onKeyDown={handleKeyDown}
        aria-describedby={captionId}
      >
        <GalleryLightboxHeader
          image={current}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <GalleryLightboxImageViewport image={current} viewMode={viewMode} />
        <GalleryLightboxNavigation
          currentIndex={currentIndex}
          total={total}
          onNavigate={navigate}
        />
      </DialogContent>
    </Dialog>
  );
}
