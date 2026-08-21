import Image from "next/image";

import { ProjectPageSection } from "@/components/Portfolio/ProjectPageSection";
import { normalizeGalleryItems } from "@/lib/portfolio/gallery";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";

import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

interface ProjectGalleryProps {
  gallery: PortfolioGalleryItem[];
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const items = normalizeGalleryItems(gallery);

  if (items.length === 0) {
    return null;
  }

  return (
    <ProjectPageSection
      id="gallery"
      title="Case study media"
      description="Screenshots and visual evidence from the project."
      width="wide"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {items.map((item, index) => {
          const alt = item.alt?.trim() || item.caption?.trim() || `Project screenshot ${index + 1}`;
          const caption = item.caption?.trim();

          return (
            <figure key={`${item.url}-${index}`} className={`${projectPageStyles.card} overflow-hidden`}>
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src={item.url}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              {caption ? (
                <figcaption className="border-t border-border/50 px-4 py-3 text-sm text-muted-foreground">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </ProjectPageSection>
  );
}
