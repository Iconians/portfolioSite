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
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected works</h2>
      <p className="text-muted-foreground mb-12 text-lg">
        A selection of SaaS platforms, production client work, and
        engineering-focused projects.
      </p>
      <PortfolioSectionClient portfolioItems={initialItems} />
    </section>
  );
}
