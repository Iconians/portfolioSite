import styles from "./ReviewComponent.module.css";
import { useEffect, useState } from "react";
import { review } from "../../utils/reviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export const ReviewComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % review.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + review.length) % review.length);
  };

  return (
    <div className={styles.reviewWrapper}>
      <div className={styles.reviewTitle}>
        <h2>Reviews </h2>
      </div>
      <div className={styles.reviewCardWrapper}>
        <div className={styles.mainCarouselWrapper}>
          <button onClick={prevSlide} className={styles.carouselLeftBtn}>
            {<FontAwesomeIcon icon={faChevronLeft} />}
          </button>
          <div className={styles.carouselReviewsWrapper}>
            {review.map((review, index) => (
              <div
                className={`${styles.carouselReview} ${
                  currentIndex === index ? styles.selected : ""
                }`}
                key={review.id}
              >
                <div className={styles.cardTitle}>
                  <h3>{review.title}</h3>
                  <p>{review.stars}</p>
                </div>
                <div className={styles.cardReview}>
                  <p>{review.p}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextSlide} className={styles.carouselRightBtn}>
            {<FontAwesomeIcon icon={faChevronRight} />}
          </button>
        </div>
      </div>
    </div>
  );
};
