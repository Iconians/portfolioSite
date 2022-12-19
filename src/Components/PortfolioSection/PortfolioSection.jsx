import React from "react";
import { useAppContext } from "../../../Providers/app.Context";
import { portfolioItems } from "../../PorfolioItems";
import "./PortfolioSection.css";

const PortfolioSection = () => {
  const { modalOpen } = useAppContext();
  return (
    <div className="portfolio-wrapper">
      <h2>PORTFOLIO</h2>
      {portfolioItems.map((item) => (
        <div className="portfolio-card" key={item.key}>
          <div className="img-wrapper">
            <img src={item.img} alt={item.caption} />
          </div>
          <div className="card-popup-box" id={item.id} onClick={modalOpen}>
            <div>{item.category}</div>
            <h3>{item.caption}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioSection;
