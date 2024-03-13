import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./ReviewComponent.css";

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
  ];

  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const buttonStyle = {
    width: "30px",
    background: "none",
    border: "0px",
    padding: 0,
    outline: "none",
    color: "white",
  };

  const properties = {
    prevArrow: (
      <button style={{ ...buttonStyle }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill={isDarkMode ? "white" : "black"}
        >
          <path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" />
        </svg>
      </button>
    ),
    nextArrow: (
      <button style={{ ...buttonStyle }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill={isDarkMode ? "white" : "black"}
        >
          <path d="M512 256L270 42.6v138.2H0v150.6h270v138z" />
        </svg>
      </button>
    ),
  };

  return (
    <div className="review-wrapper">
      <div className="review-title">
        <h2>Reviews</h2>
      </div>
      <div className="review-card-wrapper">
        <Slide {...properties} autoplay={false} indicators={true} arrows={true}>
          {review.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="card-title">
                <h3>{review.title}</h3>
                <p>{review.stars}</p>
              </div>
              <div className="card-review">
                <p>{review.p}</p>
              </div>
            </div>
          ))}
        </Slide>
      </div>
    </div>
  );
};
