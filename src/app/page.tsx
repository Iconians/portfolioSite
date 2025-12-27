import "./globals.css";
import { Hero } from "./Components/Hero/Hero";
import { Navigation } from "./Components/Nav/Navigation";
import dynamicImport from "next/dynamic";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import FeaturedArticles from "./Components/FeaturedArticles/FeaturedArticles";

// Disable static generation for home page - it uses many animated components
// This prevents framer-motion evaluation during build
export const dynamic = "force-dynamic";

// Dynamically import components that use framer-motion
// Note: Can't use ssr: false in Server Components, but dynamic import still helps isolate
const AnimatedSection = dynamicImport(() =>
  import("./Components/Animations/AnimatedSection").then(
    (mod) => mod.AnimatedSection
  )
);

const JokeAdviceComponent = dynamicImport(() =>
  import("./Components/Joke&AdviceComponent/JokeAdviceComponent").then(
    (mod) => mod.JokeAdviceComponent
  )
);

const ReviewComponent = dynamicImport(() =>
  import("./Components/ReviewComponet/ReviewComponent").then(
    (mod) => mod.ReviewComponent
  )
);

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
