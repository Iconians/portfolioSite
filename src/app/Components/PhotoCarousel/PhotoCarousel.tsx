"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { portfolioItems } from "@/app/utils/PorfolioItems";
import Image from "next/image";
import styles from "./PhotoCarousel.module.css";
import { motion } from "framer-motion";

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
    <motion.div
      className={styles.carouselWrapper}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.mainCarouselWrapper}>
        <button onClick={prevSlide} className={styles.carouselLeftBtn}>
          {<FontAwesomeIcon icon={faChevronLeft} />}
        </button>
        {portfolioItems.map((image, index) => (
          <Image
            width={500}
            height={500}
            src={image.img}
            alt={image.caption}
            key={image.id}
            className={`${styles.carouselImgs} ${
              currentIndex === index ? styles.selected : ""
            }`}
          />
        ))}
        <button onClick={nextSlide} className={styles.carouselRightBtn}>
          {<FontAwesomeIcon icon={faChevronRight} />}
        </button>
      </div>
    </motion.div>
  );
};
