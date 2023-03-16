import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import Modal from "./Components/Modal/Modal";
import { portfolioItems } from "./PorfolioItems";
import { JokeAdviceComponent } from "./Components/Joke&AdviceComponent/JokeAdviceComponent";
import { ReviewComponent } from "./Components/ReviewComponet/ReviewComponent";
import { ScheduleComponent } from "./Components/ScheduleBtn/ScheduleBtn";
import { ScheduleModal } from "./Components/ScheduleModal/ScheduleModal";
import { AboutModal } from "./Components/AboutModal/AboutModal";
import { ContactModal } from "./Components/ContactModal/ContactModal";

function App() {
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
        <Fade {...properties}>
          {portfolioItems.map((img) => (
            <div className="each-slide" key={img.key}>
              <div>
                <img src={img.img} alt={img.caption} />
              </div>
              <h3>{img.caption}</h3>
            </div>
          ))}
        </Fade>
        <div className="catch-phrase">
          <h2>I develop experiences that make peoples lives simple</h2>
        </div>
      </header>
      <JokeAdviceComponent />
      <ScheduleComponent />
      <PortfolioSection />
      <Modal />
      <ReviewComponent />
      <ScheduleModal />
      <AboutModal />
      <ContactModal />
    </div>
  );
}

export default App;
