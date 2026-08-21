import { normalizePlatformFeatures } from "@/lib/portfolio/platform";
import { Check } from "lucide-react";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { ProjectPageSection } from "./ProjectPageSection";

interface PlatformShowcaseProps {
  features: string[];
  title?: string;
}

export function PlatformShowcase({
  features,
  title = "Platform capabilities",
}: PlatformShowcaseProps) {
  const normalizedFeatures = normalizePlatformFeatures(features);

  if (normalizedFeatures.length === 0) {
    return null;
  }

  return (
    <ProjectPageSection
      id="platform"
      title={title}
      description="Capabilities demonstrated by this project."
      width="wide"
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {normalizedFeatures.map((feature) => (
          <li
            key={feature}
            className={`${projectPageStyles.card} ${projectPageStyles.cardPadding} flex h-full min-h-[4.5rem] items-start gap-2.5`}
          >
            <span className={projectPageStyles.iconWrap}>
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <span className="pt-1.5 text-[0.9375rem] leading-6 text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </ProjectPageSection>
  );
}
