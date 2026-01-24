import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/News_Api";
import "../styles/AdminNews.css";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const navigate=useNavigate();

  const fetchNews = async () => {
    const res = await API.get("/news");
    setNews(res.data);
  };

  const deleteNews = async (id) => {
    if (!window.confirm("Delete this news?")) return;

    try {
      await API.delete(`/news/delete-news/${id}`);
      fetchNews();
    } catch (error) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">Manage News</h2>

      <div className="admin-news-list">
        {news.map((item) => (
          <div className="admin-news-card" key={item._id}>
            <h4>{item.title}</h4>
             <p className="category">{item.category}</p>

          <div className="admin-news-actions">
              <button
                className="admin-btn"
                onClick={() => navigate(`/admin/edit-news/${item._id}`)}
              >
                Edit
              </button>

              <button
                className="admin-btn danger"
                onClick={() => deleteNews(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;
