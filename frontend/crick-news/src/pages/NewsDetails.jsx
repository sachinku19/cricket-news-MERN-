import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/NewsDetail.css";

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="%230f172a"/><circle cx="400" cy="225" r="120" stroke="%231e293b" stroke-width="6" fill="none" opacity="0.5"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="bold" fill="%233b82f6" opacity="0.8">CRICKETZONE</text></svg>`;

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive reaction counters
  const [reactions, setReactions] = useState({
    like: 12,
    fire: 8,
    cricket: 19,
    shocked: 2
  });
  const [userReacted, setUserReacted] = useState(null);

  // Fallback image gradient mapping based on article title
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      setLoading(true);
      try {
        // Fetch current article
        const res = await API.get(`/api/news/${id}`);
        setNews(res.data);
        setImageError(false);

        // Fetch all articles to extract related ones
        const allRes = await API.get("/api/news");
        const list = allRes.data || [];
        // Filter out current article and limit to 3 items
        const filtered = list.filter((item) => item._id !== id).slice(0, 3);
        setRelated(filtered);
      } catch (error) {
        addToast("Failed to load article details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="cricket-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Formatting advanced story layout...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="cricket-container">
        <div className="empty-container">
          <div className="empty-icon">📰</div>
          <p className="empty-text">Article has expired or is unavailable</p>
          <button className="back-btn" onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const handleReaction = (type) => {
    if (userReacted === type) {
      // Remove reaction
      setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
      setUserReacted(null);
    } else {
      // Add or change reaction
      setReactions(prev => {
        const next = { ...prev, [type]: prev[type] + 1 };
        if (userReacted) {
          next[userReacted] = next[userReacted] - 1;
        }
        return next;
      });
      setUserReacted(type);
    }
  };

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(news.title);

  // Parse first letter for drop cap styling
  const firstLetter = news.description ? news.description.charAt(0) : "";
  const remainingText = news.description ? news.description.slice(1) : "";

  // Dynamic reading time calculator
  const wordCount = news.description ? news.description.split(" ").length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="news-details-container">
      <div className="bg-spotlight"></div>
      
      <div className="details-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <span>← Back to Feed</span>
        </button>
      </div>

      <div className="details-layout">
        {/* Left Side: Article Content */}
        <div className="details-content-column">
          <div className="article-meta-header">
            <span className="details-category">{news.category}</span>
            <span className="read-time-badge">🕒 {readTime} min read</span>
          </div>

          <h1 className="details-title">{news.title}</h1>

          {/* Author bar info */}
          <div className="author-bar">
            <div className="author-info">
              <div className="author-avatar">
                {news.author ? news.author.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <span className="author-name">{news.author || "Sports Analyst"}</span>
                <span className="publish-date">
                  Published: {new Date(news.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Social Share Group */}
            <div className="share-buttons-group">
              <a
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn whatsapp"
                title="Share on WhatsApp"
              >
                💬
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
                title="Share on Twitter"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Featured Image */}
          <div className="details-image-wrapper">
            {!imageError && news.image ? (
              <img
                src={news.image.startsWith("http") ? news.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${news.image.replace(/^\//, "")}`}
                alt={news.title}
                className="details-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="details-image-placeholder-gradient">
                <div className="placeholder-cricket-icon">🏏</div>
                <span>{news.title}</span>
              </div>
            )}
          </div>

          {/* Article Text Body */}
          <div className="details-body-text">
            {firstLetter && (
              <p className="details-desc-paragraph">
                <span className="drop-cap">{firstLetter}</span>
                {remainingText}
              </p>
            )}
          </div>

          {/* Interactive Reactions */}
          <div className="reactions-box">
            <span className="reactions-box-title">How do you react to this story?</span>
            <div className="reactions-list">
              <button 
                className={`reaction-item ${userReacted === "like" ? "active" : ""}`}
                onClick={() => handleReaction("like")}
              >
                <span className="emoji">👍</span>
                <span className="count">{reactions.like}</span>
              </button>
              <button 
                className={`reaction-item ${userReacted === "fire" ? "active" : ""}`}
                onClick={() => handleReaction("fire")}
              >
                <span className="emoji">🔥</span>
                <span className="count">{reactions.fire}</span>
              </button>
              <button 
                className={`reaction-item ${userReacted === "cricket" ? "active" : ""}`}
                onClick={() => handleReaction("cricket")}
              >
                <span className="emoji">🏏</span>
                <span className="count">{reactions.cricket}</span>
              </button>
              <button 
                className={`reaction-item ${userReacted === "shocked" ? "active" : ""}`}
                onClick={() => handleReaction("shocked")}
              >
                <span className="emoji">😮</span>
                <span className="count">{reactions.shocked}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Author Card & Trending List */}
        <div className="details-sidebar-column">
          <div className="sidebar-card author-bio-card">
            <h3>Editorial Desk</h3>
            <div className="author-card-header">
              <div className="author-circle">
                {news.author ? news.author.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h4>{news.author || "Sports Analyst"}</h4>
                <small>Senior Cricket Writer</small>
              </div>
            </div>
            <p className="author-bio-desc">
              Providing analysis, statistics insights, and player profiles coverage for major leagues and bilateral series.
            </p>
          </div>

          <div className="sidebar-card newsletter-subscribe-card">
            <h3>Get Cricket Alerts</h3>
            <p>Subscribe to receive match summaries and wickets notifications in your feed.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="side-input" />
              <button className="side-btn" onClick={() => addToast("Alert subscription active! 📩", "success")}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Related News Stories at the bottom */}
      {related.length > 0 && (
        <div className="related-stories-section">
          <h2 className="related-section-title">Trending in Cricket</h2>
          <div className="related-stories-grid">
            {related.map((item) => (
              <NavLink to={`/news/${item._id}`} className="related-story-card" key={item._id}>
                <div className="related-card-image">
                  {item.image ? (
                    <img
                      src={item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${item.image.replace(/^\//, "")}`}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="related-placeholder-gradient">🏏</div>
                  )}
                </div>
                <div className="related-card-body">
                  <span className="related-card-cat">{item.category}</span>
                  <h4 className="related-card-title">{item.title}</h4>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
