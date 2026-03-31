"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "@/app/About/aboutPage.module.css";

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

export default function AboutContentClient({ skills }: AboutContentClientProps) {
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
            />
          </AnimatedSection>

          <div className={styles.descWrapper}>
            <AnimatedParagraph className={styles.bio} delay={0.3}>
              I&apos;m Clayton Cripe, a full-stack engineer focused on building
              performant, well-architected web applications.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.5}>
              I primarily work with Next.js, TypeScript, and PostgreSQL, where I
              design SSR-first applications, multi-tenant SaaS systems, and
              backend architectures that prioritize performance and clear
              separation of concerns.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.7}>
              My work spans both frontend and backend systems. I&apos;ve built
              applications using Node.js and SQL-based databases, and I enjoy
              thinking through architectural decisions - especially around state
              ownership, abstraction layers, and long-term maintainability.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.9}>
              Over the years, I&apos;ve built client projects, SaaS-style
              applications, and backend systems while continuously strengthening
              my computer science fundamentals in data structures, algorithms,
              and systems thinking.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.1}>
              This portfolio reflects that progression. What began as a simple
              static HTML site has evolved into a modern Next.js application
              focused on performance, clean UI, and thoughtful interaction
              design.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.3}>
              If you&apos;re looking for someone who enjoys building fast,
              maintainable software and thinking through architectural
              trade-offs, I&apos;d be glad to connect. Reach me on{" "}
              <a
                href="https://linkedin.com/in/claytoncripe"
                target="_blank"
                className={styles.link}
              >
                LinkedIn
              </a>
              .
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.5}>
              <h3>Skills/ Technologies I know</h3>
            </AnimatedParagraph>

            <AnimatedList className={styles.skillsList}>
              {skills.map((skill, index) => (
                <AnimatedListItem key={`${skill}-${index}`}>{skill}</AnimatedListItem>
              ))}
            </AnimatedList>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className={styles.contactIcons} delay={0.4}>
        <a href="mailto:claytoncripe@gmail.com">
          <Image
            src="https://img.shields.io/badge/Gmail-333333?style=for-the-badge&logo=gmail&logoColor=red"
            alt="Gmail"
            width={100}
            height={28}
            unoptimized
          />
        </a>
        <a href="https://github.com/Iconians" target="_blank">
          <Image
            src="/githubLogo.png"
            alt="GitHub"
            width={35}
            height={35}
            style={{ borderRadius: "100rem" }}
          />
        </a>
        <a href="https://www.linkedin.com/in/claytoncripe">
          <Image
            src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"
            alt="LinkedIn"
            width={100}
            height={28}
            unoptimized
          />
        </a>
      </AnimatedSection>
    </>
  );
}
