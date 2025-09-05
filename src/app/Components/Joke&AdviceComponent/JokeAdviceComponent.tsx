"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProductService from "@/app/fetches/adviceFetch";
import { jokeFetch } from "@/app/fetches/jokeFetch";
import styles from "./JokeAdviceComponent.module.css";

type jokeArr = {
  category: string;
  delivery: string;
  error: boolean;
  joke: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
  };
  id: number;
  lang: string;
  safe: boolean;
  setup: string;
  type: string;
}[];

type adviceArr = {
  advice: string;
  id: number;
}[];

type adviceType = {
  advice: { id: number; advice: string };
  response: { status: number; ok: true };
};

// const advice = new ProductService();
const adviceService = new ProductService();

export const JokeAdviceComponent = () => {
  const [joke, setJoke] = useState<jokeArr | null>(null);
  const [pieceAdvice, setPieceAdvice] = useState<adviceArr | null>(null);
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const fetchJoke = async () => {
    setLoadingJoke(true);
    const res = await jokeFetch();
    setJoke([res]);
    setLoadingJoke(false);
  };

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    const res = await adviceService.fetchAdvice();
    const adviceData = (res as adviceType).advice;
    const response = (res as adviceType).response;
    if (res && response.ok) setPieceAdvice([adviceData]);
    setLoadingAdvice(false);
  };

  useEffect(() => {
    fetchJoke();
    fetchAdvice();
  }, []);

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className={styles.wrapper}>
      {/* Joke Section */}
      <motion.div
        className={styles.container}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        <div className={styles.h2Wrapper}>
          <h2>Here&apos;s a Programming Joke for your Day 😃</h2>
        </div>
        <AnimatePresence mode="wait">
          {loadingJoke ? (
            <motion.div
              key="loading-joke"
              className={styles.loading}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Loading joke...
            </motion.div>
          ) : joke ? (
            <motion.div
              key={joke[0].id}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {joke.map((j) =>
                j.type === "single" ? (
                  <div className={styles.jokeWrapper} key={j.id}>
                    <div className={styles.jokeDiv}>{j.joke}</div>
                  </div>
                ) : (
                  <div className={styles.jokeWrapper} key={j.id}>
                    <div className={styles.setup}>{j.setup}</div>
                    <div className={styles.delivery}>{j.delivery}</div>
                  </div>
                )
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <button className={styles.fetchButton} onClick={fetchJoke}>
          Get another joke
        </button>
      </motion.div>

      {/* Advice Section */}
      <motion.div
        className={styles.container}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.h2Wrapper}>
          <h2>Here&apos;s a piece of advice for the day 😎</h2>
        </div>
        <AnimatePresence mode="wait">
          {loadingAdvice ? (
            <motion.div
              key="loading-advice"
              className={styles.loading}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Loading advice...
            </motion.div>
          ) : pieceAdvice ? (
            <motion.div
              key={pieceAdvice[0].id}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {pieceAdvice.map((a) => (
                <div className={styles.adviceWrapper} key={a.id}>
                  <div>{a.advice}</div>
                </div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <button className={styles.fetchButton} onClick={fetchAdvice}>
          Get another advice
        </button>
      </motion.div>
    </div>
  );
};
