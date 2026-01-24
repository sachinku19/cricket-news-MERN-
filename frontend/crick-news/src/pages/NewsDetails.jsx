import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/News_Api";
import "../styles/NewsDetail.css";

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleNews = async () => {
      try {
        const res = await API.get(`/news/${id}`);
        setNews(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleNews();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!news) return <p className="loading">News not found</p>;

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(news.title);

  return (
    <div className="news-details-container">
      <div className="details-layout">

        {/* Sticky Image */}
        <div className="details-image-wrapper">
          {news.image && (
            <img
              src={`http://localhost:5000/uploads/${news.image}`}
              alt={news.title}
              className="details-image"
            />
          )}
        </div>

        {/* Article Content */}
        <div className="details-content">
          <span className="details-category">{news.category}</span>
          <h2>{news.title}</h2>

          {/* Share Buttons */}
          <div className="share-bar">
            <span>Share:</span>

            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn whatsapp"
            >
              WhatsApp
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn twitter"
            >
              Twitter
            </a>
          </div>

          <div className="details-divider"></div>

          <p className="details-desc">{news.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
