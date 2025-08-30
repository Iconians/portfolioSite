import "react-slideshow-image/dist/styles.css";
import "./globals.css";
import { PhotoCarousel } from "./Components/PhotoCarousel/PhotoCarousel";
import Nav from "./Components/Nav/Nav";
import { JokeAdviceComponent } from "./Components/Joke&AdviceComponent/JokeAdviceComponent";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import Modal from "./Components/Modal/Modal";
import { ArticlesComponent } from "./Components/ArticlesComponent/ArticlesComponent";
import { ReviewComponent } from "./Components/ReviewComponet/ReviewComponent";
import { ContinuedLearning } from "./Components/ContinuedLearning/ContinuedLearning";

export default function Home() {
  // added some text
  return (
    <div className="App">
      <header className="">
        <Nav />
        <div>
          <h1>Welcome</h1>
        </div>
        <PhotoCarousel />
        <div className="catch-phrase">
          <h2>I develop experiences that make peoples lives simple</h2>
        </div>
      </header>
      <JokeAdviceComponent />
      <PortfolioSection />
      <Modal />
      {/* <ContinuedLearning /> */}
      <ArticlesComponent />
      <ReviewComponent />
    </div>
  );
}
