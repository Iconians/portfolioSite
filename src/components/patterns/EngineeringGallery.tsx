"use client";

import { useState } from "react";

import { GalleryLightbox } from "@/components/patterns/GalleryLightbox";
import { GalleryThumbnailGrid } from "@/components/patterns/GalleryThumbnailGrid";
import { cn } from "@/lib/utils";

import type { GalleryImage } from "@/design-system/types/gallery";

interface EngineeringGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function EngineeringGallery({ images, className }: EngineeringGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  return (
    <div data-slot="engineering-gallery" className={cn(className)}>
      <GalleryThumbnailGrid images={images} onSelect={setOpenIndex} />
      <GalleryLightbox
        images={images}
        openIndex={openIndex}
        onOpenIndexChange={setOpenIndex}
      />
    </div>
  );
}
