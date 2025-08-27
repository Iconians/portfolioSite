import profilePic from "../../assets/profilepic.jpg";
import "./AboutModal.css";

import { Nav } from "../Nav/Nav";
import { skillsArr } from "../../utils/skills";

export const AboutModal = () => {
  return (
    <div className={`about-modal`}>
      <Nav />
      <div className="about-dialog ">
        <div className="contactIcons">
          <a href="mailto:claytoncripe@gmail.com">
            <img src="https://img.shields.io/badge/Gmail-333333?style=for-the-badge&logo=gmail&logoColor=red" />
          </a>
          <a href="https://github.com/Iconians" target="_blank">
            <img src="/githubLogo.png" className="githubIcon" />
          </a>
          <a href="https://www.linkedin.com/in/claytoncripe" target="_blank">
            <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
          </a>
        </div>
        <div className="flex">
          <div className="img-container">
            <img src={profilePic.src} alt="" />
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
                {skillsArr.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
