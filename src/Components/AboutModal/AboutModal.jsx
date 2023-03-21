import React from "react";
import { useAppContext } from "../../Providers/app.Context";
import profilePic from "../../assets/profilepic.jpg";
import "./AboutModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const AboutModal = () => {
  const { openAbout, modalClose } = useAppContext();
  return (
    <div className={`about-modal ${openAbout ? "is-visible" : null}`}>
      <div className="about-dialog ">
        <div className="title-wrapper">
          <h2>About Page</h2>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={modalClose}
            className="fa-times about-fa-times"
          />
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
                <a
                  id="about-a"
                  href="https://ScheduleacallwithClaytonCripe.as.me/Upwork"
                >
                  {" "}
                  click Here
                </a>
              </p>
              <h3>Skills/Technologies I know</h3>
              <ul className="skills">
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>React</li>
                <li>Node</li>
                <li>GitHub</li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="btn-wrapper">
          <button name="about" >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};
