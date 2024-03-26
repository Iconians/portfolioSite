import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./Home.css";
import PortfolioSection from "../PortfolioSection/PortfolioSection";
import Modal from "../Modal/Modal";
import { portfolioItems } from "../../utils/PorfolioItems";
import { JokeAdviceComponent } from "../Joke&AdviceComponent/JokeAdviceComponent";
import { ReviewComponent } from "../ReviewComponet/ReviewComponent";
import { ScheduleModal } from "../ScheduleModal/ScheduleModal";
import { AboutModal } from "../AboutModal/AboutModal";
import { PhotoCarousel } from "../PhotoCarousel/PhotoCarousel";
import Nav from "../Nav/Nav";

export const Home = () => {
  const buttonStyle = {
    width: "30px",
    background: "none",
    border: "0px",
    cursor: "default",
  };

  const properties = {
    prevArrow: (
      <button style={{ ...buttonStyle }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#fff"
        >
          <path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" />
        </svg>
      </button>
    ),
    nextArrow: (
      <button style={{ ...buttonStyle }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#fff"
        >
          <path d="M512 256L270 42.6v138.2H0v150.6h270v138z" />
        </svg>
      </button>
    ),
  };

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
      <ReviewComponent />
    </div>
  );
};
