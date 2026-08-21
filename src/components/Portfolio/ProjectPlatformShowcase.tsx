import { PlatformShowcase } from "@/components/Portfolio/PlatformShowcase";
import { shouldShowPlatformShowcase } from "@/lib/portfolio/platform";

import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectPlatformShowcaseProps {
  project: PortfolioItem;
}

export function ProjectPlatformShowcase({ project }: ProjectPlatformShowcaseProps) {
  if (
    !shouldShowPlatformShowcase({
      showPlatformSection: project.showPlatformSection,
      platformFeatures: project.platformFeatures,
    })
  ) {
    return null;
  }

  return <PlatformShowcase features={project.platformFeatures} />;
}
