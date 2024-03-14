import { useEffect, useState } from "react";
import ProductService from "../../fetches/adviceFetch";
import { jokeFetch } from "../../fetches/jokeFetch";
import "./JokeAdviceComponent.css";

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

const advice = new ProductService();
export const JokeAdviceComponent = () => {
  const [joke, setJoke] = useState<jokeArr>([]);
  const [pieceAdvice, setPieceAdvice] = useState<adviceArr>([]);
  useEffect(() => {
    jokeFetch().then((res) => setJoke([res]));
  }, []);

  useEffect(() => {
    advice.fetchAdvice().then((res) => {
      const advice = (res as adviceType).advice;
      const response = (res as adviceType).response;
      if (res && response.ok) {
        setPieceAdvice([advice]);
      }
    });
  }, []);

  return (
    <div className="joke-advice-wrapper">
      <div className="joke-container">
        <div className="h2-wrapper">
          <h2>Here's a Programing Joke for your Day 😃</h2>
        </div>
        {joke.length ? (
          <>
            {joke.map((joke) =>
              joke.type === "single" ? (
                <div className="joke-wrapper" key={joke.id}>
                  <div className="joke-div">{joke.joke}</div>
                </div>
              ) : (
                <div className="joke-wrapper" key={joke.id}>
                  <div className="setup">{joke.setup}</div>
                  <div className="delivery">{joke.delivery}</div>
                </div>
              )
            )}
          </>
        ) : null}
      </div>
      <div className="advice-container">
        <div className="h2-wrapper">
          <h2>Here's a piece of advice for the day 😎</h2>
        </div>
        {pieceAdvice.length ? (
          <>
            {pieceAdvice.map((advice) => (
              <div className="advice-wrapper" key={advice.id}>
                <div>{advice.advice}</div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};
