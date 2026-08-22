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
    <section id="projects" className="py-16 scroll-mt-20">
      <Heading level={2} className="mb-4">
        Featured Projects
      </Heading>
      <Text variant="description" className="mb-12">
        A selection of SaaS platforms, production client work, and
        engineering-focused projects.
      </Text>
      <PortfolioSectionClient portfolioItems={initialItems} />
    </section>
  );
}
