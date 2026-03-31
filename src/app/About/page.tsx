import { skillsArr } from "@/lib/skills";
import { Navigation } from "@/components/Nav/Navigation";
import AboutContentClient from "@/components/about/AboutContentClient";
import styles from "./aboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Navigation />
      <AboutContentClient skills={skillsArr} />
    </div>
  );
}
