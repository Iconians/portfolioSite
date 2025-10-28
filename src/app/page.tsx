import "./globals.css";
import { Hero } from "./Components/Hero/Hero";
import { Navigation } from "./Components/Nav/Navigation";
import { JokeAdviceComponent } from "./Components/Joke&AdviceComponent/JokeAdviceComponent";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import Modal from "./Components/Modal/Modal";
import { ReviewComponent } from "./Components/ReviewComponet/ReviewComponent";
import { AnimatedSection } from "./Components/Animations/AnimatedSection";

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

        <Modal />

        <section id="reviews" className="scroll-mt-20">
          <AnimatedSection>
            <ReviewComponent />
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}
