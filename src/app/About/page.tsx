import {
  AboutCtaSection,
  AboutFocusSection,
  AboutNarrativeSection,
  AboutPrinciplesSection,
  AboutProfileSection,
  AboutSkillsSection,
} from "@/components/about/AboutContent";
import { Container } from "@/components/layout/Container";
import { SectionBand } from "@/components/layout/SectionBand";
import { Navigation } from "@/components/Nav/Navigation";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { engineeringArr, skillsArr } from "@/lib/skills";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main>
        <SectionBand tone="canvas">
          <Container>
            <AboutProfileSection />
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AboutFocusSection />
          </Container>
        </SectionBand>

        <SectionBand tone="canvas">
          <Container>
            <AboutPrinciplesSection />
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AboutSkillsSection
              skills={skillsArr}
              engineeringSkills={engineeringArr}
            />
          </Container>
        </SectionBand>

        <SectionBand tone="canvas">
          <Container>
            <AboutNarrativeSection />
          </Container>
        </SectionBand>

        <SectionBand tone="surfaceAlt">
          <Container>
            <AboutCtaSection />
          </Container>
        </SectionBand>
      </main>

      <SiteFooter />
    </div>
  );
}
