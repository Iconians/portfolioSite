import { getAllPortfolioItems } from "@/lib/data/portfolio";
import { PortfolioSectionClient } from "./PortfolioSectionClient";

const PortfolioSection = async () => {
  const portfolioItems = await getAllPortfolioItems();

  return (
    <section id="projects" className="py-16 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
      <p className="text-muted-foreground mb-12 text-lg">
        Professional client work and personal projects showcasing full-stack
        development
      </p>
      <PortfolioSectionClient portfolioItems={portfolioItems} />
    </section>
  );
};

export default PortfolioSection;
