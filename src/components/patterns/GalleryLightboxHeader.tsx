import {
  getGalleryLightboxZoomToggleLabel,
  isGalleryLightboxActualSize,
  toggleGalleryLightboxViewMode,
  type GalleryLightboxViewMode,
} from "@/components/patterns/gallery-lightbox-view";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

import type { GalleryImage } from "@/design-system/types/gallery";

interface GalleryLightboxHeaderProps {
  image: GalleryImage;
  viewMode: GalleryLightboxViewMode;
  onViewModeChange: (mode: GalleryLightboxViewMode) => void;
}

export function GalleryLightboxHeader({
  image,
  viewMode,
  onViewModeChange,
}: GalleryLightboxHeaderProps) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-2">
      <div className="min-w-0 flex-1 space-y-0.5">
        <DialogTitle className="text-sm font-medium leading-snug line-clamp-2">
          {image.alt}
        </DialogTitle>
        {image.caption ? (
          <DialogDescription
            id="gallery-lightbox-caption"
            className="text-left text-xs line-clamp-2"
          >
            {image.caption}
          </DialogDescription>
        ) : (
          <DialogDescription className="sr-only">
            Full-size project screenshot
          </DialogDescription>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        aria-pressed={isGalleryLightboxActualSize(viewMode)}
        aria-label={getGalleryLightboxZoomToggleLabel(viewMode)}
        onClick={() => onViewModeChange(toggleGalleryLightboxViewMode(viewMode))}
      >
        {isGalleryLightboxActualSize(viewMode) ? "Fit" : "100%"}
      </Button>
    </div>
  );
}
