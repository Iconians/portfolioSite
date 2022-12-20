import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

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

  return (
    <div className="review-wrapper">
      <div className="review-title">
        <h2>Reviews</h2>
      </div>
      <div className="review-card-wrapper">
        <Slide autoplay={false}>
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
