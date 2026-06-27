"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "@/app/About/aboutPage.module.css";
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

const AnimatedList = dynamic(
  () =>
    import("@/components/Animations/AnimatedList").then((mod) => mod.default),
  { ssr: false },
);

const AnimatedListItem = dynamic(
  () =>
    import("@/components/Animations/AnimatedList").then(
      (mod) => mod.AnimatedListItem,
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
      <AnimatedSection className={styles.header}>
        <h1>About Me</h1>
      </AnimatedSection>

      <AnimatedSection className={styles.content} staggerChildren={0.2}>
        <div className={styles.flexWrapper}>
          <AnimatedSection className={styles.imgContainer}>
            <Image
              src="/profilepic.jpg"
              alt="Clayton Cripe"
              width={500}
              height={400}
              className={styles.profileImage}
              priority
            />
          </AnimatedSection>

          <div className={styles.descWrapper}>
            <AnimatedParagraph className={styles.bio} delay={0.3}>
              I&apos;m Clayton Cripe, a software engineer who enjoys building
              operational software that solves business problems—not just
              shipping features.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.5}>
              Most of the work I do falls into four areas:
              <ul>
                <li>Operational software that replaces manual workflows</li>
                <li>SaaS platforms built for long-term growth</li>
                <li>Internal tools and client portals</li>
                <li>Backend systems designed around maintainability</li>
              </ul>
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.7}>
              I primarily work with Next.js, TypeScript, PostgreSQL, and modern
              cloud infrastructure, but I spend just as much time understanding
              business workflows, system architecture, and how software fits
              into an organization&apos;s day-to-day operations.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.9}>
              Rather than starting with technology, I start with the problem.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.1}>
              Whether I&apos;m building a customer-facing SaaS platform,
              replacing spreadsheet-driven processes, or connecting multiple
              business systems together, my goal is always the same: create
              software that&apos;s simple to maintain, easy to extend, and
              genuinely useful to the people who rely on it every day.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.4}>
              <h3>What I value as an engineer</h3>
              <ul>
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

            <AnimatedParagraph className={styles.bio} delay={1.5}>
              Outside of client work, I mentor developers, write technical
              articles, and continue studying software engineering fundamentals.
              I&apos;m interested in understanding not just how software works,
              but why certain designs remain maintainable as systems grow.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.7}>
              If you&apos;re looking for someone who enjoys solving problems
              beyond the UI and thinking through the full system—from
              architecture to deployment—I&apos;d be glad to connect. Reach me
              on{" "}
              <a
                href="https://linkedin.com/in/claytoncripe"
                target="_blank"
                className={styles.link}
              >
                LinkedIn
              </a>
              .
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.4}>
              <h3>Core Technologies</h3>
            </AnimatedParagraph>

            <AnimatedList className={styles.skillsList}>
              {skills.map((skill, index) => (
                <AnimatedListItem key={`${skill}-${index}`}>
                  {skill}
                </AnimatedListItem>
              ))}
            </AnimatedList>

            <AnimatedParagraph className={styles.bio} delay={0.4}>
              <h3>Engineering</h3>
            </AnimatedParagraph>

            <AnimatedList className={styles.skillsList}>
              {engineeringArr.map((skill, index) => (
                <AnimatedListItem key={`${skill}-${index}`}>
                  {skill}
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
