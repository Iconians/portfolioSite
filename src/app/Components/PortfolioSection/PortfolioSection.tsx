"use client";
import { portfolioItems } from "@/app/utils/PorfolioItems";
import { useAppContext } from "@/app/Providers/app.Context";
import "./PortfolioSection.css";
import Image from "next/image";

const PortfolioSection = () => {
  const { modalOpen } = useAppContext();
  return (
    <>
      <div>
        <h2>PORTFOLIO</h2>
      </div>
      <div className="portfolio-wrapper">
        {portfolioItems.map((item) => (
          <div className="portfolio-card" key={item.key}>
            <div className="img-wrapper">
              <Image
                width={500}
                height={500}
                src={item.img}
                alt={item.caption}
              />
            </div>
            <div
              className="card-popup-box"
              id={item.id.toString()}
              onClick={modalOpen}
            >
              <div>{item.category}</div>
              <h3>{item.caption}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PortfolioSection;
