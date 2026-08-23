"use client";

import Image from "next/image";

import {
  isGalleryLightboxActualSize,
  type GalleryLightboxViewMode,
} from "@/components/patterns/gallery-lightbox-view";
import { cn } from "@/lib/utils";

import type { GalleryImage } from "@/design-system/types/gallery";

interface GalleryLightboxImageViewportProps {
  image: GalleryImage;
  viewMode: GalleryLightboxViewMode;
}

export function GalleryLightboxImageViewport({
  image,
  viewMode,
}: GalleryLightboxImageViewportProps) {
  const isActualSize = isGalleryLightboxActualSize(viewMode);

  return (
    <div
      data-slot="gallery-lightbox-viewport"
      className={cn(
        "min-h-0 flex-1 rounded-lg bg-muted",
        isActualSize
          ? "overflow-auto"
          : "flex items-center justify-center overflow-hidden"
      )}
    >
      {isActualSize ? (
        // Intrinsic dimensions are required for pixel-accurate UI inspection in actual-size mode.
        // eslint-disable-next-line @next/next/no-img-element -- next/image constrains max dimensions in 100% mode
        <img
          src={image.url}
          alt={image.alt}
          className="block h-auto w-auto max-w-none"
          decoding="async"
        />
      ) : (
        <div className="relative h-full w-full min-h-[12rem]">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="95vw"
            className="object-contain object-center"
            priority
          />
        </div>
      )}
    </div>
  );
}
