import { Check } from "lucide-react";

import { Surface } from "@/components/layout/Surface";
import { Text } from "@/components/typography/Text";
import { normalizePlatformFeatures } from "@/lib/portfolio/platform";

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
      eyebrow="PLATFORM"
      title={title}
      description="Engineering capabilities demonstrated by this project."
      width="wide"
      headerClassName="px-5 md:px-6"
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {normalizedFeatures.map((feature) => (
          <li key={feature}>
            <Surface
              variant="card"
              padding="default"
              className="flex h-full min-h-[4.5rem] items-start gap-2.5 border-border/80"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-card text-ds-accent"
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              <Text className="pt-0.5 text-sm leading-relaxed text-foreground">
                {feature}
              </Text>
            </Surface>
          </li>
        ))}
      </ul>
    </ProjectPageSection>
  );
}
