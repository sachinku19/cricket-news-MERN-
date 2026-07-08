import { useState, useEffect } from "react";
import API from "../services/News_Api";
import getCountdown from "../utils/getCountdown";
import { useToast } from "../context/ToastContext";
import "../styles/upcoming-live.css";

const UpcomingCricket = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeNow, setTimeNow] = useState(Date.now());
  const { addToast } = useToast();

  const fetchMatches = async () => {
    try {
      const res = await API.get("/api/cricket/upcoming");
      setMatches(res.data.data || res.data || []);
    } catch (error) {
      addToast("Failed to fetch upcoming matches", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    // countdown tick
    const timer = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cricket-container">
      <div className="bg-spotlight"></div>
      
      <div className="cricket-header-section">
        <h2 className="cricket-title upcoming">📅 Upcoming Fixtures</h2>
        <p className="cricket-subtitle">Count down to the next big match events in world cricket.</p>
      </div>

      {loading ? (
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Loading fixtures schedule...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-container">
          <div className="empty-icon">📅</div>
          <p className="empty-text">No upcoming matches scheduled. Check back later!</p>
        </div>
      ) : (
        <div className="match-grid">
          {matches.map((match) => {
            const countdown = getCountdown(match.dateTimeGMT);

            return (
              <div className="match-card upcoming" key={match.id}>
                <div className="match-header">
                  <span className="match-series">International Tour</span>
                  <span className="badge upcoming">UPCOMING</span>
                </div>

                <h3 className="match-name">{match.name}</h3>
                <p className="match-status">{match.status}</p>

                {countdown ? (
                  <div className="countdown-box">
                    <div className="countdown-title">Match Starts In</div>
                    <div className="countdown">
                      <div className="countdown-unit">
                        <span className="countdown-val">{countdown.days}</span>
                        <small className="countdown-lbl">Days</small>
                      </div>
                      <div className="countdown-unit">
                        <span className="countdown-val">{countdown.hours}</span>
                        <small className="countdown-lbl">Hrs</small>
                      </div>
                      <div className="countdown-unit">
                        <span className="countdown-val">{countdown.minutes}</span>
                        <small className="countdown-lbl">Mins</small>
                      </div>
                      <div className="countdown-unit">
                        <span className="countdown-val">{countdown.seconds}</span>
                        <small className="countdown-lbl">Secs</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="match-started">Match In Progress / Starting Soon</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingCricket;
