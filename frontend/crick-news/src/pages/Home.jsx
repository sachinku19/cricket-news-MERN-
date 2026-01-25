import { useState, useEffect } from "react";
import API from "../services/News_Api";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      const res = await API.get("/api/news");
      setNews(res.data);
    } catch (error) {
      alert("Failed to fetch news");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="home-container">
      <h2 className="page-title">Cricket News 🏏</h2>

      {news.length === 0 && <p className="empty-text">No news available</p>}

      <div className="news-list">
        {news.map((item) => (
          <div key={item._id} className="news-item">
            {item.image && (
              <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${news.image}`}
                alt={item.title}
                className="news-image"
              />
            )}
            
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <h4 className="news-category">{item.category}</h4>
              <p className="news-desc">
                {item.description.length > 120
                  ? item.description.slice(0, 120) + "..."
                  : item.description}
              </p>
              <button
                className="details-btn"
                onClick={() =>  navigate(`/news/${item._id}`)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
