import "./globals.css";
import { AnimatedSection } from "@/components/Animations/AnimatedSection";
import { EngineeringPhilosophy } from "@/components/EngineeringPhilosophy/EngineeringPhilosophy";
import FeaturedArticles from "@/components/FeaturedArticles/FeaturedArticles";
import { Hero } from "@/components/Hero/Hero";
import { Container } from "@/components/layout/Container";
import { Navigation } from "@/components/Nav/Navigation";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import { ReviewComponent } from "@/components/ReviewComponent/ReviewComponent";
import { TechStack } from "@/components/TechStack/TechStack";
import { WhatIEnjoyBuilding } from "@/components/WhatIEnjoyBuilding/WhatIEnjoyBuilding";
import { getAllArticles } from "@/lib/data/articles";
import { getPublishedPortfolioItems } from "@/lib/data/portfolio";
import { getAllReviews } from "@/lib/data/reviews";

export const revalidate = 3600;

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

      <Container as="main" className="py-16">
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

        <AnimatedSection>
          <ReviewComponent initialReviews={reviews} />
        </AnimatedSection>
      </Container>
    </div>
  );
}
