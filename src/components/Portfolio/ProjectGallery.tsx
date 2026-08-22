import { EngineeringGallery } from "@/components/patterns/EngineeringGallery";
import { ProjectPageSection } from "@/components/Portfolio/ProjectPageSection";
import { normalizeGalleryItems } from "@/lib/portfolio/gallery";

import type { GalleryImage } from "@/design-system/types/gallery";
import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

interface ProjectGalleryProps {
  gallery: PortfolioGalleryItem[];
}

function mapPortfolioGalleryItem(
  item: PortfolioGalleryItem,
  index: number
): GalleryImage {
  const alt =
    item.alt?.trim() || item.caption?.trim() || `Project screenshot ${index + 1}`;
  const caption = item.caption?.trim();

  return {
    url: item.url,
    alt,
    caption: caption || undefined,
  };
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const items = normalizeGalleryItems(gallery);

  if (items.length === 0) {
    return null;
  }

  const images = items.map(mapPortfolioGalleryItem);

  return (
    <ProjectPageSection
      id="gallery"
      title="Case study media"
      description="Screenshots and visual evidence from the project."
      width="wide"
    >
      <EngineeringGallery images={images} />
    </ProjectPageSection>
  );
}
