"use client";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "@/app/Providers/app.Context";
import styles from "./modal.module.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Modal = () => {
  const { modalData, modalClose, openModal } = useAppContext();

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      modalClose();
    }
  };

  // if (!openModal || !modalData) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {openModal && modalData && (
        <motion.div
          className={styles.modalWrapper}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleWrapperClick}
        >
          <motion.div
            className={styles.modalDialog}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.btnDiv}>
              <FontAwesomeIcon
                icon={faTimes}
                onClick={modalClose}
                className={styles.faTimes}
              />
            </div>
            <div className={styles.projectName}>
              <h2>{modalData.caption}</h2>
              <h4>{modalData.category}</h4>
            </div>
            <div className={styles.imgDiv}>
              <Image
                height={330}
                width={500}
                src={modalData.img}
                alt="project Picture"
              />
            </div>
            <div className={styles.descWrapper}>
              <p>{modalData.desc}</p>
              {modalData.url && (
                <a
                  href={modalData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here to view Site
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
