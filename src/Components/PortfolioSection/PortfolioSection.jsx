import React from "react";
import "./PortfolioSection.css";

const PortfolioSection = ({ portfolioItems }) => {
  return (
    <div className="portfolio-wrapper">
      {portfolioItems.map((item) => (
        <div className="portfolio-card" key={item.key}>
          <div className="img-wrapper">
            <img src={item.img} alt={item.caption} />
          </div>
          <div className="card-popup-box">
            <div>{item.category}</div>
            <h3>{item.caption}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioSection;
