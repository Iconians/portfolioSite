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
      {learningArray.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.course}</p>
          <p>{course.site}</p>
          <a href={course.url}>{course.url}</a>
        </div>
      ))}
    </div>
  );
};
