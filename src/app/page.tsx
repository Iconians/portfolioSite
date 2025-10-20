import "react-slideshow-image/dist/styles.css";
import "./globals.css";
import styles from "./homePage.module.css";
import { PhotoCarousel } from "./Components/PhotoCarousel/PhotoCarousel";
import Nav from "./Components/Nav/Nav";
import { JokeAdviceComponent } from "./Components/Joke&AdviceComponent/JokeAdviceComponent";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import Modal from "./Components/Modal/Modal";
import { ReviewComponent } from "./Components/ReviewComponet/ReviewComponent";
import { AnimatedContainer } from "./Components/Animations/AnimatedContainer";
import AnimatedHeading from "./Components/Animations/AnimateHeading";
import { AnimatedSection } from "./Components/Animations/AnimatedSection";
import { NavClient } from "./Components/Nav/NavClient";
import { CatchPhrase } from "./Components/CatchPhrase/CatchPhrase";

export default function Home() {
  return (
    <AnimatedContainer>
      <header className={styles.header}>
        <NavClient />
        <AnimatedHeading level={1}>Welcome</AnimatedHeading>
        <PhotoCarousel />
        <CatchPhrase />
      </header>

      <AnimatedSection>
        <JokeAdviceComponent />
      </AnimatedSection>

      <AnimatedSection>
        <PortfolioSection />
      </AnimatedSection>

      {/* <AnimatedSection> */}
      <Modal />
      {/* </AnimatedSection> */}

      <AnimatedSection>
        <ReviewComponent />
      </AnimatedSection>
    </AnimatedContainer>

    // <div className="App">
    //   <header className="">
    //     <Nav />
    //     <div>
    //       <h1>Welcome</h1>
    //     </div>
    //     <PhotoCarousel />
    //     <div className="catch-phrase">
    //       <h2>I develop experiences that make peoples lives simple</h2>
    //     </div>
    //   </header>
    //   <JokeAdviceComponent />
    //   <PortfolioSection />
    //   <Modal />
    //   <ArticlesComponent />
    //   <ReviewComponent />
    // </div>
  );
}
