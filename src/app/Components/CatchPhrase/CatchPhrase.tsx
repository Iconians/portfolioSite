import { AnimatedSection } from "../Animations/AnimatedSection";
import AnimatedHeading from "../Animations/AnimateHeading";
import styles from "./CatchPhrase.module.css";

export const CatchPhrase = () => {
  return (
    <AnimatedSection className={styles.catchPhrase}>
      <AnimatedHeading level={2}>
        I develop experiences that make peoples lives simple
      </AnimatedHeading>
    </AnimatedSection>
  );
};
