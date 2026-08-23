import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import {
  pickHomeFeaturedProjects,
  pickRemainingPortfolioProjects,
} from "@/lib/portfolio/home-featured";

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

  const featuredItems = pickHomeFeaturedProjects(initialItems);
  const remainingItems = pickRemainingPortfolioProjects(initialItems, featuredItems);

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <Section id="projects" className="py-16">
      <Stack gap="sm" className="mb-12">
        <Heading variant="eyebrow">WORK</Heading>
        <Heading level={2}>Featured engineering work</Heading>
        <Text variant="description">
          Four systems that demonstrate different engineering concerns—operational
          workflows, multi-tenant SaaS, realtime domains, and content architecture.
        </Text>
      </Stack>
      <PortfolioSectionClient
        featuredItems={featuredItems}
        remainingItems={remainingItems}
      />
    </Section>
  );
}
