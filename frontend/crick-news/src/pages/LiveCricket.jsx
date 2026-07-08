import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/upcoming-live.css";

const LiveCricket = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      const res = await API.get("/api/cricket/live");
      // CricAPI lists matches in data.data or data
      const data = res.data.data || res.data || [];
      // Filter only live matches just in case
      setMatches(data);
    } catch (error) {
      addToast("Failed to fetch live matches", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Auto refresh every 30s
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cricket-container">
      <div className="bg-spotlight"></div>
      
      <div className="cricket-header-section">
        <h2 className="cricket-title live">
          <span className="live-dot-pulse"></span>
          <span>Live Match Center</span>
        </h2>
        <p className="cricket-subtitle">Real-time scores from around the globe. Refreshes every 30s.</p>
      </div>

      {loading ? (
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Fetching live scorecards...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-container">
          <div className="empty-icon">🏏</div>
          <p className="empty-text">No matches are live right now. Go check the upcoming fixtures!</p>
        </div>
      ) : (
        <div className="match-grid">
          {matches.map((match) => (
            <div className="match-card live" key={match.id}>
              <div className="match-header">
                <span className="match-series">Cricket Series Match</span>
                <span className="badge live">LIVE</span>
              </div>

              <h3 className="match-name">{match.name}</h3>
              <p className="match-status">{match.status}</p>

              {match.score && match.score.length > 0 ? (
                <div className="scorecard">
                  {match.score.map((sc, i) => (
                    <div className="score-row" key={i}>
                      <span className="inning-name">{sc.inning}</span>
                      <span className="score-value">{sc.r}/{sc.w} <small>({sc.o} ov)</small></span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="scorecard scorecard-empty">
                  <p>Scorecard details will appear shortly</p>
                </div>
              )}

              <button
                className="details-btn"
                onClick={() => navigate(`/match/${match.id}`)}
              >
                <span>View Full Scorecard</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveCricket;
