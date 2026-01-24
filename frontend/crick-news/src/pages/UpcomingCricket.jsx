import { useState, useEffect } from "react";
import API from "../services/News_Api";
import getCountdown from "../utils/getCountdown";
import "../styles/upcoming-live.css"

const UpcomingCricket = () => {
  const [matches, setmatches] = useState([]);
  const [timeNow, setTimeNow] = useState(Date.now());

  const fetchMatches = async () => {
    const res = await API.get("/api/cricket/upcoming");
    setmatches(res.data.data || []);
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
      <h2 className="cricket-title upcoming">📅 Upcoming Matches</h2>

      <div className="match-grid">
        {matches.map((ind) => {
          const countdown = getCountdown(ind.dateTimeGMT);

          return (
            <div className="match-card upcoming" key={ind.id}>
              <div className="match-header">
                <span className="match-name">{ind.name}</span>
                <span className="badge upcoming">UPCOMING</span>
              </div>

              <p className="match-status">{ind.status}</p>

              {countdown ? (
                <div className="countdown">
                  <div><span>{countdown.days}</span><small>D</small></div>
                  <div><span>{countdown.hours}</span><small>H</small></div>
                  <div><span>{countdown.minutes}</span><small>M</small></div>
                  <div><span>{countdown.seconds}</span><small>S</small></div>
                </div>
              ) : (
                <p className="match-started">Match Starting Soon</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingCricket;
