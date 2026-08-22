import "./globals.css";
import { AnimatedSection } from "@/components/Animations/AnimatedSection";
import { EngineeringPhilosophy } from "@/components/EngineeringPhilosophy/EngineeringPhilosophy";
import FeaturedArticles from "@/components/FeaturedArticles/FeaturedArticles";
import { Hero } from "@/components/Hero/Hero";
import { Navigation } from "@/components/Nav/Navigation";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import { ReviewComponent } from "@/components/ReviewComponent/ReviewComponent";
import { TechStack } from "@/components/TechStack/TechStack";
import { WhatIEnjoyBuilding } from "@/components/WhatIEnjoyBuilding/WhatIEnjoyBuilding";
import { getAllArticles } from "@/lib/data/articles";
import { getPublishedPortfolioItems } from "@/lib/data/portfolio";
import { getAllReviews } from "@/lib/data/reviews";

// Enable static generation with revalidation for better performance as
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [portfolioItems, articles, reviews] = await Promise.all([
    getPublishedPortfolioItems(),
    getAllArticles(),
    getAllReviews(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <AnimatedSection>
          <EngineeringPhilosophy />
        </AnimatedSection>

        <AnimatedSection>
          <TechStack />
        </AnimatedSection>

        <AnimatedSection>
          <WhatIEnjoyBuilding />
        </AnimatedSection>

        <AnimatedSection>
          <PortfolioSection initialItems={portfolioItems} />
        </AnimatedSection>

        <AnimatedSection>
          <FeaturedArticles initialArticles={articles} />
        </AnimatedSection>

        <section id="reviews" className="scroll-mt-20">
          <AnimatedSection>
            <ReviewComponent initialReviews={reviews} />
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}
