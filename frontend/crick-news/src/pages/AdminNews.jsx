import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/AdminNews.css";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchNews = async () => {
    try {
      const res = await API.get("/api/news");
      setNews(res.data);
    } catch (err) {
      addToast("Failed to retrieve stories library", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) return;

    try {
      await API.delete(`/api/news/delete-news/${id}`);
      addToast("Article deleted successfully", "success");
      fetchNews();
    } catch (error) {
      addToast("Failed to delete article. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Loading news stories queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="bg-spotlight"></div>
      
      <div className="admin-header-section">
        <h2 className="admin-title">Manage News</h2>
        <p className="admin-subtitle">Edit or delete existing stories. Content updates instantly across all user feeds.</p>
      </div>

      {news.length === 0 ? (
        <div className="empty-container">
          <div className="empty-icon">📂</div>
          <p className="empty-text">No articles found in database. Create a new article to get started.</p>
          <button className="back-btn" onClick={() => navigate("/add-news")}>Add News</button>
        </div>
      ) : (
        <div className="admin-news-list">
          {news.map((item) => (
            <div className="admin-news-card" key={item._id}>
              {item.image ? (
                <div className="admin-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="admin-news-image"
                  />
                  <span className="admin-category-badge">{item.category}</span>
                </div>
              ) : (
                <div className="admin-image-wrapper placeholder">
                  <span>🏏</span>
                  <span className="admin-category-badge">{item.category}</span>
                </div>
              )}

              <div className="admin-card-body">
                <h4 className="admin-card-title">{item.title}</h4>
                
                <div className="admin-news-actions">
                  <button
                    className="admin-btn edit"
                    onClick={() => navigate(`/admin/edit-news/${item._id}`)}
                  >
                    <span>Edit</span>
                  </button>

                  <button
                    className="admin-btn danger"
                    onClick={() => deleteNews(item._id)}
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNews;
