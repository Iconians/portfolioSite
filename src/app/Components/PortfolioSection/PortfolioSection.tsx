"use client";
import { portfolioItems } from "@/app/utils/PorfolioItems";
import { useAppContext } from "@/app/Providers/app.Context";
import "./PortfolioSection.css";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./PortfolioSection.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300 },
  },
};

const PortfolioSection = () => {
  const { modalOpen } = useAppContext();
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>PORTFOLIO</h2>
      <motion.div
        className={styles.portfolioWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {portfolioItems.map((item) => (
          <motion.div
            className={styles.portfolioCard}
            key={item.key}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            onClick={() => modalOpen(item)}
          >
            <div className={styles.imgWrapper}>
              <Image
                width={500}
                height={500}
                src={item.img}
                alt={item.caption}
                className={styles.image}
              />
            </div>
            <motion.div
              className={styles.cardPopupBox}
              whileHover={{ y: -10, opacity: 1 }}
            >
              <div className={styles.category}>{item.category}</div>
              <h3 className={styles.caption}>{item.caption}</h3>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PortfolioSection;
