import { useState, useEffect } from "react";
import API from "../services/News_Api";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

// Offline embedded SVG data URI fallback image (Guaranteed to load under any network environment)
const FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="%230f172a"/><circle cx="400" cy="225" r="120" stroke="%231e293b" stroke-width="6" fill="none" opacity="0.5"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="bold" fill="%233b82f6" opacity="0.8">CRICKETZONE</text></svg>`;

const Home = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
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

  // Real-time client-side search & category filtering
  const filteredNews = news.filter((item) => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

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
        <div className="section-header-row">
          <div className="section-header">
            <h2 className="section-title">Latest Stories</h2>
            <div className="section-divider"></div>
          </div>

          {/* Search and Category Control controls-row */}
          <div className="news-controls-row">
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="Search stories by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="news-search-input"
              />
            </div>
            
            <div className="category-pills-wrapper">
              {["All", "Match", "Player", "Team", "Tournament"].map((cat) => (
                <button
                  key={cat}
                  className={`category-pill-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">🏏</div>
            <p className="empty-text">No matching news stories found. Try a different search query!</p>
          </div>
        ) : (
          <div className="news-grid-magazine">
            {filteredNews.map((item, index) => {
              // Determine card style pattern based on indices of current filtered subset
              let cardClass = "news-card-standard";
              if (index === 0) {
                cardClass = "news-card-featured";
              } else if (index === 1 || index === 2) {
                cardClass = "news-card-highlight";
              }

              const formattedImg = item.image && (item.image.startsWith("http") 
                ? item.image 
                : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${item.image.replace(/^\//, "")}`);

              return (
                <div 
                  key={item._id} 
                  className={`news-card-item ${cardClass}`}
                  onClick={() => navigate(`/news/${item._id}`)}
                >
                  <div className="news-card-image-wrapper">
                    {item.image ? (
                      <img
                        src={formattedImg}
                        alt={item.title}
                        className="news-card-img"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    ) : (
                      <div className="news-card-placeholder-gradient">
                        <span className="placeholder-icon">🏏</span>
                      </div>
                    )}
                    <span className="news-card-badge">{item.category}</span>
                  </div>

                  <div className="news-card-content">
                    <h3 className="news-card-title">{item.title}</h3>
                    <p className="news-card-desc">
                      {index === 0 
                        ? item.description.length > 220 ? `${item.description.slice(0, 220)}...` : item.description
                        : item.description.length > 110 ? `${item.description.slice(0, 110)}...` : item.description
                      }
                    </p>
                    <div className="news-card-footer">
                      <span className="news-card-author">By {item.author || "Admin"}</span>
                      <span className="news-card-date">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
