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
      title={title}
      description="Capabilities demonstrated by this project."
      width="wide"
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {normalizedFeatures.map((feature) => (
          <li key={feature}>
            <Surface
              variant="card"
              padding="default"
              className="flex h-full min-h-[4.5rem] items-start gap-2.5"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center text-primary"
              >
                <Check className="h-4 w-4" aria-hidden />
              </span>
              <Text className="pt-1.5 text-foreground">{feature}</Text>
            </Surface>
          </li>
        ))}
      </ul>
    </ProjectPageSection>
  );
}
