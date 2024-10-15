import React from "react";
import profilePic from "../../assets/profilepic.jpg";
import "./AboutModal.css";

import { Nav } from "../Nav/Nav";

export const AboutModal = () => {
  return (
    <div className={`about-modal`}>
      <Nav />
      <div className="about-dialog ">
        <div className="title-wrapper"></div>
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
                I am a passionate full-stack web developer specializing in
                React. My love for technology began at a young age and has only
                grown over time. With a deep understanding of web technologies,
                I’m committed to crafting intuitive and visually appealing
                websites tailored to your vision. Whether you need a personal
                project, a business website, or simply want to chat about ideas,
                I’d love to connect. Check out my work or reach me on
                <a id="about-a" href="https://linkedin.com/in/claytoncripe">
                  {" "}
                  LinkedIn
                </a>
                !
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
      </div>
    </div>
  );
};
