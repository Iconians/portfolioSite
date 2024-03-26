import styles from "./ReviewComponent.module.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export const ReviewComponent = () => {
  const review = [
    {
      title: "Basic Event Website Set Up",
      stars: "⭐⭐⭐⭐⭐",
      p: "Clayton was awesome to work with. He is a great communicator and even follows up with detailed information after each task within the project. For our project he helped us set up a new event website on WordPress for our annual company conference and he did an incredible job. Throughout the process we added and subtracted tasks and he always kept up with the new vision perfectly. When I had an idea, Clayton researched how to accomplish the task or already had the knowledge to complete the ask quickly. I recommend working with Clayton on your website project.",
      id: 0,
    },
    {
      title:
        "You will get A beautiful landing page that will showcase your business to client",
      stars: "⭐⭐⭐⭐⭐",
      p: "Clayton is a hard working and wonderful man, so positive and helpful. He really worked hard. to help me define my vision and purpose, and went above and beyond. He is literally worth many of a thousand dollars. Looking forward to hiring him for more projects.",
      id: 1,
    },
    {
      title: "Dog washing Website in React",
      stars: "⭐⭐⭐⭐⭐",
      p: "Big kudos to Clayton for his exceptional work on crafting a React landing page for me. Clayton's expertise in front-end development truly shone through in the polished and professional final product. Throughout the project, Clayton maintained excellent communication and attention to detail, ensuring a seamless collaboration. I wholeheartedly endorse Clayton for any front-end development projects and eagerly anticipate future opportunities to work together.",
      id: 2,
    },
    {
      title:
        "We're seeking 85 freelancers to participate in our website testing project!",
      stars: "⭐⭐⭐⭐⭐",
      p: "Clayton is wonderful to work with. Very good freelancer and greatly recommended!",
      id: 3,
    },
  ];

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
        <h2>Reviews</h2>
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
