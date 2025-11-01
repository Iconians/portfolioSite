"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProductService from "@/app/fetches/adviceFetch";
import { jokeFetch } from "@/app/fetches/jokeFetch";
import { Card, CardContent } from "@/app/Components/ui/card";
import { Button } from "@/app/Components/ui/button";
import { Smile, Lightbulb, RefreshCw } from "lucide-react";

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
    <div className="flex flex-wrap justify-around gap-4 p-4">
      {/* Joke Section */}
      <motion.div
        className="flex-1 min-w-[280px] max-w-[500px]"
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        <Card className="group hover:border-primary transition-all hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Smile className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Programming Joke 😃</h3>
            </div>
            <AnimatePresence mode="wait">
              {loadingJoke ? (
                <motion.div
                  key="loading-joke"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-sm italic text-muted-foreground text-center"
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
                      <p
                        key={j.id}
                        className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors"
                      >
                        {j.joke}
                      </p>
                    ) : (
                      <div key={j.id} className="space-y-2">
                        <p className="text-sm leading-relaxed group-hover:text-foreground transition-colors">
                          {j.setup}
                        </p>
                        <p className="text-sm font-semibold text-primary leading-relaxed">
                          {j.delivery}
                        </p>
                      </div>
                    )
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchJoke}
              className="mt-4 w-full"
              disabled={loadingJoke}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loadingJoke ? "animate-spin" : ""}`}
              />
              Get another joke
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advice Section */}
      <motion.div
        className="flex-1 min-w-[280px] max-w-[500px]"
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="group hover:border-primary transition-all hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Daily Advice 😎</h3>
            </div>
            <AnimatePresence mode="wait">
              {loadingAdvice ? (
                <motion.div
                  key="loading-advice"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-sm italic text-muted-foreground text-center"
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
                    <p
                      key={a.id}
                      className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors"
                    >
                      {a.advice}
                    </p>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAdvice}
              className="mt-4 w-full"
              disabled={loadingAdvice}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  loadingAdvice ? "animate-spin" : ""
                }`}
              />
              Get another advice
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
