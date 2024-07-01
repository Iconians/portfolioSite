import "./ArticlesComponent.css";
import { articles } from "../../utils/articles";

export const ArticlesComponent = () => {
  return (
    <div>
      <div>
        <h2>My Articles</h2>
      </div>
      <div className="article-container">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <div>
              <img src={article.img} alt="" className="article-img" />
              <h3>{article.title}</h3>
              <p>{article.p}</p>
            </div>
            <a href={article.url} className="card-popup-box">
              Read Here
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
