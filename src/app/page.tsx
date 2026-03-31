import "./globals.css";
import { Hero } from "@/components/Hero/Hero";
import { Navigation } from "@/components/Nav/Navigation";
import { EngineeringPhilosophy } from "@/components/EngineeringPhilosophy/EngineeringPhilosophy";
import { TechStack } from "@/components/TechStack/TechStack";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import FeaturedArticles from "@/components/FeaturedArticles/FeaturedArticles";
import { AnimatedSection } from "@/components/Animations/AnimatedSection";
import { JokeAdviceComponent } from "@/components/Joke&AdviceComponent/JokeAdviceComponent";
import { ReviewComponent } from "@/components/ReviewComponet/ReviewComponent";

// Enable static generation with revalidation for better performance as
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <AnimatedSection>
          <EngineeringPhilosophy />
        </AnimatedSection>

        {/* <section id="personality" className="scroll-mt-20 py-12">
          <AnimatedSection>
            <JokeAdviceComponent /
            hi
        </section> */}

        <AnimatedSection>
          <TechStack />
        </AnimatedSection>

        <AnimatedSection>
          <PortfolioSection />
        </AnimatedSection>

        <AnimatedSection>
          <FeaturedArticles />
        </AnimatedSection>

        <section id="reviews" className="scroll-mt-20">
          <AnimatedSection>
            <ReviewComponent />
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}
