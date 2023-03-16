import React from "react";
import { useAppContext } from "../../Providers/app.Context";
import profilePic from "../../assets/profilePic.jpg";
import "./AboutModal.css";

export const AboutModal = () => {
  const { openAbout, modalClose } = useAppContext();
  return (
    <div className={`about-modal ${openAbout ? "is-visible" : null}`}>
      <div className="about-dialog ">
        <div className="title-wrapper">
          <h2>About Page</h2>
        </div>
        <div className="flex">
          <div className="img-container">
            <img src={profilePic} alt="" />
          </div>
          <div className="desc-wrappper">
            <div className="name-wrapper">
              <h2>Clayton Cripe</h2>
            </div>
            <div className="p-wrapper">
              <p>
                I am a React front-end web developer that has a passion for
                computers which developed at a young age and has grown ever
                since then. I will put my extensive knowlege to work for you and
                create a beautiful website for your passion or brand. have a
                site you want created, please schedule a meeting
                <a href="https://ScheduleacallwithClaytonCripe.as.me/Upwork">
                  {" "}
                  click Here
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="btn-wrapper">
          <button name="about" onClick={modalClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
