"use client";

import Image from "next/image";

import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";

import type { GalleryImage } from "@/design-system/types/gallery";

interface GalleryThumbnailGridProps {
  images: GalleryImage[];
  onSelect: (index: number) => void;
  className?: string;
}

export function GalleryThumbnailGrid({
  images,
  onSelect,
  className,
}: GalleryThumbnailGridProps) {
  const total = images.length;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5",
        className
      )}
    >
      {images.map((image, index) => {
        const caption = image.caption?.trim();

        return (
          <figure
            key={`${image.url}-${index}`}
            className={cn(projectPageStyles.card, "overflow-hidden")}
          >
            <button
              type="button"
              className="block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => onSelect(index)}
              aria-label={`View image ${index + 1} of ${total}: ${image.alt}`}
            >
              <div className="relative min-h-[220px] bg-muted md:min-h-[280px]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-center"
                />
              </div>
            </button>
            {caption ? (
              <figcaption
                className="border-t border-border/50 px-4 py-3 text-sm text-muted-foreground"
              >
                {caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
