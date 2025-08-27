import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./PhotoCarousel.css";
import { portfolioItems } from "../../utils/PorfolioItems";

export const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % portfolioItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (currentIndex - 1 + portfolioItems.length) % portfolioItems.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % portfolioItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carouselWrapper">
      <div className="mainCarouselWrapper">
        <button onClick={prevSlide} className="carouselLeftBtn">
          {<FontAwesomeIcon icon={faChevronLeft} />}
        </button>
        {portfolioItems.map((image, index) => (
          <img
            src={image.img}
            alt={image.caption}
            key={image.id}
            className={`carouselImgs ${
              currentIndex === index ? "selected" : ""
            }`}
          />
        ))}
        <button onClick={nextSlide} className="carouselRightBtn">
          {<FontAwesomeIcon icon={faChevronRight} />}
        </button>
      </div>
    </div>
  );
};
