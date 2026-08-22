import AboutContentClient from "@/components/about/AboutContentClient";
import { Container } from "@/components/layout/Container";
import { Navigation } from "@/components/Nav/Navigation";
import { skillsArr } from "@/lib/skills";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Container as="main" className="py-8 md:py-12">
        <AboutContentClient skills={skillsArr} />
      </Container>
    </div>
  );
}
