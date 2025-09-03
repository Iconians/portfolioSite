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
              I’m Clayton Cripe, a passionate full-stack web developer
              specializing in React and modern web technologies. My journey with
              computers started when I was young, tinkering with MS-DOS just to
              load a Chip ‘n Dale game — and I never stopped exploring from
              there. Over the years,
            </AnimatedParagraph>
            <AnimatedParagraph className={styles.bio} delay={0.5}>
              I’ve taken several computer courses, from IT and hardware
              fundamentals to in-depth software development, steadily building a
              solid foundation on both sides of technology. I’ve worked with
              nearly every major operating system — Windows 95, 98, XP, 7, 10,
              11 — and now develop primarily on macOS, which I love for its
              developer-friendly experience. This lifelong curiosity has grown
              into a career focused on crafting intuitive, high-performance, and
              visually appealing websites tailored to each client’s vision.
            </AnimatedParagraph>
            <AnimatedParagraph className={styles.bio} delay={0.8}>
              Whether you’re looking for a personal project, a business website,
              or just want to chat about ideas, I’d love to connect. Check out
              my work or reach me on{" "}
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
