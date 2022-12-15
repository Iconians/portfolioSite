import { Fade } from "react-slideshow-image";
import minimalista from "./assets/minimalistapic.png";
import fullStack from "./assets/fullstackapppic.jpg";
import codeRad from "./assets/codeRadPic.png";
import porfolio from "./assets/portfoliositepic.png";
import todoApp from "./assets/todoapp.jpg";
import sass from "./assets/SaaSTopPage.png";
import adviceApp from "./assets/adviceApp.jpg";
import podpic from "./assets/podpic.png";
import "react-slideshow-image/dist/styles.css";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import PortfolioSection from "./Components/PortfolioSection/PortfolioSection";
import { useState } from "react";
import Modal from "./Components/Modal/Modal";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const images = [
    {
      url: minimalista,
      caption: "Minimalista landing page",
      key: "1",
    },
    {
      url: porfolio,
      caption: "Portfolio landing page",
      key: "2",
    },
    {
      url: codeRad,
      caption: "CodeRad landing page",
      key: "3",
    },
    {
      url: fullStack,
      caption: "Clothing Essentials Ecommerce App",
      key: "4",
    },
  ];

  const portfolioItems = [
    {
      img: minimalista,
      caption: "Minimalista landing page",
      desc: "This is a simple static Landing page",
      category: "Landing Page",
      url: "https://claysminimalistapro.netlify.app/",
      key: 1,
      id: 7,
    },
    {
      img: porfolio,
      caption: "Portfolio landing page",
      desc: "This is a portfolio site that has some nice features built into it like light and dark modes and popups and more",
      category: "Landing Page",
      url: "https://claysfolio.netlify.app/",
      key: 2,
      id: 6,
    },
    {
      img: codeRad,
      caption: "codeRad Landing page",
      desc: "This is a landing page that has some nice visuals",
      category: "Landing Page",
      url: "https://clayscoderad.netlify.app/",
      key: 3,
      id: 5,
    },
    {
      img: sass,
      caption: "Front Landing page",
      desc: "This is a software as a service or SaaS for short landing page",
      category: "Landing Page",
      url: "https://clayssass.netlify.app/",
      key: 4,
      id: 4,
    },
    {
      img: fullStack,
      caption: "Clothing Essentials E-commerce site",
      desc: "This is a E-commerce Site that is similar amazon but without the full back-end hooked up as I didn't want to get into the business of selling clothing",
      category: "React App",
      url: "https://iconians.github.io/shopperApp/",
      key: 5,
      id: 3,
    },
    {
      img: todoApp,
      caption: "To Do App",
      desc: "This is a simple to do app that you can put your notes or list of items in",
      category: "React App",
      url: "https://iconians.github.io/todoApp/",
      key: 6,
      id: 2,
    },
    {
      img: adviceApp,
      caption: "advice App",
      desc: "This is a app that generates a piece of advice ",
      category: "React App",
      url: "https://iconians.github.io/advice-app/",
      key: 7,
      id: 1,
    },
    {
      img: podpic,
      caption: "Podcast page",
      desc: "this is an example of a podcast webpage ",
      category: "Landing Page",
      url: "https://clayspodcastproject.netlify.app/",
      key: 8,
      id: 0,
    },
  ];

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

  const modalOpen = ({ target: { id } }) => {
    const selectedItem = portfolioItems.filter(
      (item) => item.id === parseInt(id)
    );
    console.log(id, selectedItem);
    setModalData(selectedItem);
    setOpenModal(true);
  };

  const modalClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="App">
      <header className="">
        <Nav />
        <Fade {...properties}>
          {images.map((img) => (
            <div className="each-slide" key={img.key}>
              <div>
                <img src={img.url} alt={img.caption} />
              </div>
              <h3>{img.caption}</h3>
            </div>
          ))}
        </Fade>
        <div className="catch-phrase">
          <h2>I develop experiences that make peoples lives simple</h2>
        </div>
      </header>
      <PortfolioSection portfolioItems={portfolioItems} modal={modalOpen} />
      <Modal
        modalData={modalData}
        modalClose={modalClose}
        openModal={openModal}
      />
    </div>
  );
}

export default App;
