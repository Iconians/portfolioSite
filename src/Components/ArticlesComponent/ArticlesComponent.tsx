const articles = [
  {
    id: 1,
    img: "/triviaApp.png",
    title: "Unleash Your Inner Volcanologist with This Engaging Trivia App",
    p: "Are you fascinated by volcanoes? Do you think you have what it takes to be a volcanologist? Well, now’s your chance to find out! Introducing the Volcano Trivia App — an interactive and educational platform designed to test your knowledge of all things volcanic.",
    url: "https://medium.com/@claytoncripe/unleash-your-inner-volcanologist-with-this-engaging-trivia-app-57391580c570",
    date: "Mar 27th 2024",
  },
  {
    id: 2,
    img: "",
    title: "React Context API",
    p: "When we talk about React Context a lot of us may think of the origins of where it came from which was Remix. Still, certain parts of Remix got incorporated into React at a certain point.",
    url: "https://medium.com/@claytoncripe/react-context-api-816fd0533338",
    date: "Mar 7th 2023",
  },
];

export const ArticlesComponent = () => {
  return (
    <div>
      <div>
        <h2>My Articles</h2>
      </div>
      {articles.map((article) => (
        <div key={article.id}>
          <img src={article.img} alt="" />
          <h3>{article.title}</h3>
          <p>{article.p}</p>
          <a href={article.url}>Read Here</a>
        </div>
      ))}
    </div>
  );
};
