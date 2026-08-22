"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import { AboutSkillsGroup } from "@/components/about/AboutSkillsGroup";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Link } from "@/components/ui/link";
import { engineeringArr } from "@/lib/skills";

const AnimatedSection = dynamic(
  () =>
    import("@/components/Animations/AnimatedSection").then(
      (mod) => mod.AnimatedSection,
    ),
  { ssr: false },
);

const AnimatedParagraph = dynamic(
  () =>
    import("@/components/Animations/AnimatedParagraphs").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

interface AboutContentClientProps {
  skills: string[];
}

export default function AboutContentClient({
  skills,
}: AboutContentClientProps) {
  return (
    <>
      <AnimatedSection>
        <Section className="py-0 text-center">
          <Heading level={1}>About Me</Heading>
        </Section>
      </AnimatedSection>

      <AnimatedSection staggerChildren={0.2}>
        <div className="flex flex-wrap items-start gap-8">
          <AnimatedSection className="min-w-[300px] flex-1 text-center">
            <Image
              src="/profilepic.jpg"
              alt="Clayton Cripe"
              width={500}
              height={400}
              className="mx-auto max-w-full rounded-2xl object-cover shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              priority
            />
          </AnimatedSection>

          <Stack gap="md" className="min-w-[min(100%,400px)] flex-[2] text-left">
            <AnimatedParagraph delay={0.3}>
              <Text className="leading-relaxed">
                I&apos;m Clayton Cripe, a software engineer who enjoys building
                operational software that solves business problems—not just
                shipping features.
              </Text>
            </AnimatedParagraph>

            <AnimatedParagraph delay={0.5}>
              <Text className="leading-relaxed">
                Most of the work I do falls into four areas:
              </Text>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Operational software that replaces manual workflows</li>
                <li>SaaS platforms built for long-term growth</li>
                <li>Internal tools and client portals</li>
                <li>Backend systems designed around maintainability</li>
              </ul>
            </AnimatedParagraph>

            <AnimatedParagraph delay={0.7}>
              <Text className="leading-relaxed">
                I primarily work with Next.js, TypeScript, PostgreSQL, and modern
                cloud infrastructure, but I spend just as much time understanding
                business workflows, system architecture, and how software fits
                into an organization&apos;s day-to-day operations.
              </Text>
            </AnimatedParagraph>

            <AnimatedParagraph delay={0.9}>
              <Text className="leading-relaxed">
                Rather than starting with technology, I start with the problem.
              </Text>
            </AnimatedParagraph>

            <AnimatedParagraph delay={1.1}>
              <Text className="leading-relaxed">
                Whether I&apos;m building a customer-facing SaaS platform,
                replacing spreadsheet-driven processes, or connecting multiple
                business systems together, my goal is always the same: create
                software that&apos;s simple to maintain, easy to extend, and
                genuinely useful to the people who rely on it every day.
              </Text>
            </AnimatedParagraph>

            <AnimatedParagraph delay={0.4}>
              <Heading level={3} className="mb-4 text-center text-2xl">
                What I value as an engineer
              </Heading>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  Build software around the business, not around the technology.
                </li>
                <li>
                  Prefer maintainable systems over clever implementations.
                </li>
                <li>Design for change, not just today&apos;s requirements.</li>
                <li>
                  Choose tools because they&apos;re appropriate—not because
                  they&apos;re trendy.
                </li>
              </ul>
            </AnimatedParagraph>

            <AnimatedParagraph delay={1.5}>
              <Text className="leading-relaxed">
                Outside of client work, I mentor developers, write technical
                articles, and continue studying software engineering fundamentals.
                I&apos;m interested in understanding not just how software works,
                but why certain designs remain maintainable as systems grow.
              </Text>
            </AnimatedParagraph>

            <AnimatedParagraph delay={1.7}>
              <Text className="leading-relaxed">
                If you&apos;re looking for someone who enjoys solving problems
                beyond the UI and thinking through the full system—from
                architecture to deployment—I&apos;d be glad to connect. Reach me
                on{" "}
                <Link
                  href="https://linkedin.com/in/claytoncripe"
                  external
                  className="text-primary"
                >
                  LinkedIn
                </Link>
                .
              </Text>
            </AnimatedParagraph>

            <AnimatedParagraph delay={0.4}>
              <AboutSkillsGroup title="Core Technologies" items={skills} listKey="core" />
              <AboutSkillsGroup title="Engineering" items={engineeringArr} listKey="engineering" />
            </AnimatedParagraph>
          </Stack>
        </div>
      </AnimatedSection>
    </>
  );
}
