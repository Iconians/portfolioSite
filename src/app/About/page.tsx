import { Navigation } from "../Components/Nav/Navigation";
import { skillsArr } from "../utils/skills";
import Image from "next/image";
import { AnimatedSection } from "../Components/Animations/AnimatedSection";
import styles from "./aboutPage.module.css";
import AnimatedParagraph from "../Components/Animations/AnimatedParagraphs";
import AnimatedList, {
  AnimatedListItem,
} from "../Components/Animations/AnimatedList";

export default function aboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Navigation />

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
              I’m Clayton Cripe, a passionate full-stack web developer with a
              strong foundation in both modern web technologies and core
              computer science concepts. My journey began as a kid tinkering
              with MS-DOS just to load a Chip ‘n Dale game — and that spark of
              curiosity has never left.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.5}>
              Over the years I’ve explored nearly every major operating system —
              from Windows 95 through 11, to macOS, which I now use as my
              primary development environment. My path has taken me from
              hardware fundamentals to building intuitive, high-performance
              applications for clients.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.7}>
              In late 2021, I enrolled in the Devslopes Academy full-stack
              program. While studying, I began freelancing in 2022 to gain
              real-world experience, replacing early school projects in my
              portfolio with professional client work and reviews. I graduated
              in 2024, but along the way I also pursued independent projects to
              deepen my backend knowledge (Node.js, Go, Python, PostgreSQL,
              SQLC) and strengthen my CS fundamentals through writing articles
              on data structures, algorithms, and problem-solving.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.9}>
              My portfolio itself reflects that growth: it started as a static
              HTML/CSS/JavaScript site in 2022, evolved into a React +
              TypeScript app in 2023, and most recently became a Next.js 15
              project with animations woven throughout the design. From
              motion-driven blog cards to animated sections and code blocks, I
              aim to create experiences that are not only functional but also
              engaging and dynamic.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.1}>
              Whether you’re looking for a polished website, a performant
              backend system, or just want to chat about ideas, I’d love to
              connect. You can explore my work here or reach me on{" "}
              <a
                href="https://linkedin.com/in/claytoncripe"
                target="_blank"
                className={styles.link}
              >
                LinkedIn
              </a>
              .
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={1.3}>
              <h3>Skills/ Technologies I know</h3>
            </AnimatedParagraph>
            <AnimatedList className={styles.skillsList}>
              {skillsArr.map((skill, index) => (
                <AnimatedListItem key={index}>{skill}</AnimatedListItem>
              ))}
            </AnimatedList>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className={styles.contactIcons} delay={0.4}>
        <a href="mailto:claytoncripe@gmail.com">
          <img
            src="https://img.shields.io/badge/Gmail-333333?style=for-the-badge&logo=gmail&logoColor=red"
            alt="Gmail"
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
          <img
            src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"
            alt="LinkedIn"
          />
        </a>
      </AnimatedSection>
    </div>
  );
}
