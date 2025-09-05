import { Nav } from "../Components/Nav/Nav";
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
      <Nav />

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
              Windows 95 through 11, and now macOS — and I’ve built experience
              from hardware fundamentals all the way up to building intuitive,
              high-performance applications. My work spans frontend frameworks
              like <strong>React and Next.js</strong>, backend development with{" "}
              <strong>Node.js, Go, and Python</strong>, and database design with{" "}
              <strong>PostgreSQL and SQLC</strong>.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.7}>
              I also write about data structures, algorithms, and
              problem-solving to strengthen my CS fundamentals, with articles
              covering topics like queues, stacks, sorting algorithms, and Big-O
              analysis. This balance of theory and practice helps me craft
              solutions that are not only functional but efficient and scalable.
            </AnimatedParagraph>

            <AnimatedParagraph className={styles.bio} delay={0.9}>
              Whether you’re looking for a polished website, a performant
              backend system, or just want to discuss ideas, I’d love to
              connect. You can explore my work here or reach me on{" "}
              <a
                href="https://linkedin.com/in/claytoncripe"
                target="_blank"
                className={styles.link}
              >
                LinkedIn
              </a>
              !
            </AnimatedParagraph>

            <h3>Skills/ Technologies I know</h3>
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
