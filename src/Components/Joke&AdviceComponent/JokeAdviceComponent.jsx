import React, { useEffect, useState } from "react";
import ProductService from "../../fetches/adviceFetch";
import { jokeFetch } from "../../fetches/jokeFetch";
import "./JokeAdviceComponent.css";

const advice = new ProductService();
export const JokeAdviceComponent = () => {
  const [joke, setJoke] = useState([]);
  const [peiceAdvice, setpeiceAdvice] = useState([]);
  useEffect(() => {
    jokeFetch().then((res) => setJoke([res]));
  }, []);

  useEffect(() => {
    advice.fetchAdvice().then((res) => {
      if (res && res.response.ok) {
        setpeiceAdvice([res.advice]);
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
        {peiceAdvice.length ? (
          <>
            {peiceAdvice.map((advice) => (
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
