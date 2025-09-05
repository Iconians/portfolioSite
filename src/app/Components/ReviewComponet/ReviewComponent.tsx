"use client";
import styles from "./ReviewComponent.module.css";
import { useState } from "react";
import { review } from "@/app/utils/reviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export const ReviewComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % review.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + review.length) % review.length);
  };

  const slideVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 20 },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      transition: { duration: 0.2 },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  return (
    <div className={styles.reviewWrapper}>
      <div className={styles.reviewTitle}>
        <h2>Client Reviews</h2>
      </div>
      <div className={styles.reviewCardWrapper}>
        <div className={styles.mainCarouselWrapper}>
          <button onClick={handlePrev} className={styles.carouselLeftBtn}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className={styles.carouselReviewsWrapper}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={review[currentIndex].id}
                className={styles.carouselReview}
                custom={direction}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3>{review[currentIndex].title}</h3>
                    <p className={styles.stars}>
                      {"★".repeat(review[currentIndex].stars)}
                      {"☆".repeat(5 - review[currentIndex].stars)}
                    </p>
                  </div>
                </div>
                <div className={styles.cardReview}>
                  <p>{review[currentIndex].p}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button onClick={handleNext} className={styles.carouselRightBtn}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
    // <div className={styles.reviewWrapper}>
    //   <div className={styles.reviewTitle}>
    //     <h2>Client Reviews</h2>
    //   </div>
    //   <div className={styles.reviewCardWrapper}>
    //     <div className={styles.mainCarouselWrapper}>
    //       <button onClick={prevSlide} className={styles.carouselLeftBtn}>
    //         <FontAwesomeIcon icon={faChevronLeft} />
    //       </button>
    //       <div className={styles.carouselReviewsWrapper}>
    //         {review.map((item, index) => (
    //           <div
    //             className={`${styles.carouselReview} ${
    //               currentIndex === index ? styles.selected : ""
    //             }`}
    //             key={item.id}
    //           >
    //             <div className={styles.cardHeader}>
    //               {/* <img src={""} alt="Profile" className={styles.avatar} /> */}
    //               <div>
    //                 <h3>{item.title}</h3>
    //                 <p className={styles.stars}>
    //                   {"★".repeat(item.stars)}
    //                   {"☆".repeat(5 - item.stars)}
    //                 </p>
    //               </div>
    //             </div>
    //             <div className={styles.cardReview}>
    //               <p>{item.p}</p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //       <button onClick={nextSlide} className={styles.carouselRightBtn}>
    //         <FontAwesomeIcon icon={faChevronRight} />
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

// import styles from "./ReviewComponent.module.css";
// import { useEffect, useState } from "react";
// import { review } from "../../utils/reviews";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faChevronLeft,
//   faChevronRight,
// } from "@fortawesome/free-solid-svg-icons";

// export const ReviewComponent = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((currentIndex + 1) % review.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((currentIndex - 1 + review.length) % review.length);
//   };

//   return (
//     <div className={styles.reviewWrapper}>
//       <div className={styles.reviewTitle}>
//         <h2>Reviews </h2>
//       </div>
//       <div className={styles.reviewCardWrapper}>
//         <div className={styles.mainCarouselWrapper}>
//           <button onClick={prevSlide} className={styles.carouselLeftBtn}>
//             {<FontAwesomeIcon icon={faChevronLeft} />}
//           </button>
//           <div className={styles.carouselReviewsWrapper}>
//             {review.map((review, index) => (
//               <div
//                 className={`${styles.carouselReview} ${
//                   currentIndex === index ? styles.selected : ""
//                 }`}
//                 key={review.id}
//               >
//                 <div className={styles.cardTitle}>
//                   <h3>{review.title}</h3>
//                   <p>{review.stars}</p>
//                 </div>
//                 <div className={styles.cardReview}>
//                   <p>{review.p}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button onClick={nextSlide} className={styles.carouselRightBtn}>
//             {<FontAwesomeIcon icon={faChevronRight} />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
