"use client";

import {
  isGalleryLightboxActualSize,
  type GalleryLightboxViewMode,
} from "@/components/patterns/gallery-lightbox-view";

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

  if (isActualSize) {
    return (
      <div
        data-slot="gallery-lightbox-viewport"
        className="min-h-0 flex-1 overflow-auto rounded-lg bg-muted"
      >
        {/* Intrinsic pixels — scroll only when dimensions exceed the viewport. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- actual-size requires native intrinsic dimensions */}
        <img
          src={image.url}
          alt={image.alt}
          decoding="async"
          draggable={false}
          className="block h-auto w-auto max-w-none shrink-0"
        />
      </div>
    );
  }

  return (
    <div
      data-slot="gallery-lightbox-viewport"
      className="h-fit w-full shrink-0 overflow-hidden rounded-lg bg-muted"
    >
      {/* Fit: width-driven at all breakpoints — viewport height follows rendered image. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- fit uses intrinsic aspect ratio via w-full h-auto */}
      <img
        src={image.url}
        alt={image.alt}
        decoding="async"
        draggable={false}
        className="block h-auto w-full max-h-[min(58dvh,65vh)] sm:max-h-[min(75dvh,82vh)]"
      />
    </div>
  );
}
