import "./globals.css";
import { AnimatedSection } from "@/components/Animations/AnimatedSection";
import { EngineeringPhilosophy } from "@/components/EngineeringPhilosophy/EngineeringPhilosophy";
import FeaturedArticles from "@/components/FeaturedArticles/FeaturedArticles";
import { Hero } from "@/components/Hero/Hero";
import { Container } from "@/components/layout/Container";
import { SectionBand } from "@/components/layout/SectionBand";
import { Navigation } from "@/components/Nav/Navigation";
import { PlatformEvolution } from "@/components/PlatformEvolution/PlatformEvolution";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import { ReviewComponent } from "@/components/ReviewComponent/ReviewComponent";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { EngineeringStack } from "@/components/TechStack/TechStack";
import { WhatIEnjoyBuilding } from "@/components/WhatIEnjoyBuilding/WhatIEnjoyBuilding";
import { getAllArticles } from "@/lib/data/articles";
import { getAllReviews } from "@/lib/data/reviews";
import { getPublishedPortfolioItems } from "@/lib/project-read";

export const revalidate = 3600;

export default async function Home() {
  const [portfolioItems, articles, reviews] = await Promise.all([
    getPublishedPortfolioItems(),
    getAllArticles(),
    getAllReviews(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main>
        <SectionBand tone="canvas">
          <Container>
            <Hero />
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AnimatedSection>
              <EngineeringPhilosophy />
            </AnimatedSection>
          </Container>
        </SectionBand>

        <SectionBand tone="canvas">
          <Container>
            <AnimatedSection>
              <WhatIEnjoyBuilding />
            </AnimatedSection>
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AnimatedSection>
              <EngineeringStack />
            </AnimatedSection>
          </Container>
        </SectionBand>

        <SectionBand tone="canvas">
          <Container>
            <AnimatedSection>
              <PortfolioSection initialItems={portfolioItems} />
            </AnimatedSection>
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AnimatedSection>
              <PlatformEvolution />
            </AnimatedSection>
          </Container>
        </SectionBand>

        <SectionBand tone="canvas">
          <Container>
            <AnimatedSection>
              <FeaturedArticles initialArticles={articles} />
            </AnimatedSection>
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AnimatedSection>
              <ReviewComponent initialReviews={reviews} />
            </AnimatedSection>
          </Container>
        </SectionBand>
      </main>

      <SiteFooter />
    </div>
  );
}
