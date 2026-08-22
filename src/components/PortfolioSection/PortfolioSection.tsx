import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

import { PortfolioSectionClient } from "./PortfolioSectionClient";

import type { PortfolioItem } from "@/lib/types/portfolio";

interface PortfolioSectionProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioSection({
  initialItems,
}: PortfolioSectionProps) {
  if (!initialItems || initialItems.length === 0) {
    return null;
  }

  return (
    <Section id="projects" className="py-16">
      <Stack gap="sm" className="mb-12">
        <Heading level={2}>Featured Projects</Heading>
        <Text variant="description">
          A selection of SaaS platforms, production client work, and
          engineering-focused projects.
        </Text>
      </Stack>
      <PortfolioSectionClient portfolioItems={initialItems} />
    </Section>
  );
}
