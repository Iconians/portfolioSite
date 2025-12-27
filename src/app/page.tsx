import "./globals.css";
import { Hero } from "./Components/Hero/Hero";
import { Navigation } from "./Components/Nav/Navigation";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import FeaturedArticles from "./Components/FeaturedArticles/FeaturedArticles";
import { AnimatedSection } from "./Components/Animations/AnimatedSection";
import { JokeAdviceComponent } from "./Components/Joke&AdviceComponent/JokeAdviceComponent";
import { ReviewComponent } from "./Components/ReviewComponet/ReviewComponent";

// Enable static generation with revalidation for better performance as
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <section id="personality" className="scroll-mt-20 py-12">
          <AnimatedSection>
            <JokeAdviceComponent />
          </AnimatedSection>
        </section>

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
