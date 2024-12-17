import "react-slideshow-image/dist/styles.css";
import "./Home.css";
import PortfolioSection from "../PortfolioSection/PortfolioSection";
import Modal from "../Modal/Modal";
import { JokeAdviceComponent } from "../Joke&AdviceComponent/JokeAdviceComponent";
import { ReviewComponent } from "../ReviewComponet/ReviewComponent";
import { PhotoCarousel } from "../PhotoCarousel/PhotoCarousel";
import Nav from "../Nav/Nav";
import { ContinuedLearning } from "../ContinuedLearning/ContinuedLearning";
import { ArticlesComponent } from "../ArticlesComponent/ArticlesComponent";

export const Home = () => {
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
      {/* <ArticlesComponent /> */}
      <ReviewComponent />
    </div>
  );
};
