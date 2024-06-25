import { useNavigate } from "react-router-dom";
import "./ContinuedLearning.css";

const learningArray = [
  {
    id: 1,
    title: "Web Accessibility",
    course: "Introduction to web accessibility",
    site: "Frontend Mentors",
    url: "https://www.frontendmentor.io/learning-paths",
  },
  {
    id: 2,
    title: "Algorithms",
    course: "The Last Algorithms Course You'll Need",
    site: "Frontend Masters",
    url: "https://frontendmasters.com/courses/algorithms/",
  },
];

export const ContinuedLearning = () => {
  return (
    <div>
      <div>
        <h2>My Continuing Exploration Into Tech</h2>
      </div>
      <div className="continuing-ed-container">
        {learningArray.map((course) => (
          <div key={course.id} className="continuing-ed-card">
            <div>
              <h3>{course.title}</h3>
              <p>{course.course}</p>
              <p>{course.site}</p>
            </div>
            <a href={course.url} className="card-popup-box">
              Read Here
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
