import { useState, useEffect } from "react";
import API from "../services/News_Api";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Home = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchNews = async () => {
    try {
      const res = await API.get("/api/news");
      setNews(res.data);
    } catch (error) {
      addToast("Failed to fetch news articles", "error");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="home-container">
      <div className="bg-spotlight"></div>
      
      {/* Hero Banner Section */}
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-tag">CricketZone Premium</span>
          <h1 className="hero-heading">Where Cricket Lives</h1>
          <p className="hero-subheading">
            Your ultimate destination for live scores, match breakdowns, tournament schedules, and exclusive news.
          </p>
        </div>
      </div>

      <div className="news-section">
        <div className="section-header">
          <h2 className="section-title">Latest Stories</h2>
          <div className="section-divider"></div>
        </div>

        {news.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">🏏</div>
            <p className="empty-text">No stories available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="news-list">
            {news.map((item) => (
              <div key={item._id} className="news-item">
                {item.image ? (
                  <div className="news-image-wrapper">
                    <img
                      src={item.image && (item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${item.image.replace(/^\//, "")}`)}
                      alt={item.title}
                      className="news-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1540747737956-37872404a821?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <span className="news-category-badge">{item.category}</span>
                  </div>
                ) : (
                  <div className="news-image-wrapper placeholder-img">
                    <span className="placeholder-icon">🏏</span>
                    <span className="news-category-badge">{item.category}</span>
                  </div>
                )}

                <div className="news-content">
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-desc">
                    {item.description.length > 120
                      ? item.description.slice(0, 120) + "..."
                      : item.description}
                  </p>
                  <button
                    className="details-btn"
                    onClick={() => navigate(`/news/${item._id}`)}
                  >
                    <span>Read Article</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
