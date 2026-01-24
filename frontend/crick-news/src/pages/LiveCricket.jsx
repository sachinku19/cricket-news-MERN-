import {useState,useEffect} from 'react';
import API from "../services/News_Api";


const LiveCricket = () => {

    const [matches, setmatches] = useState([]);

    const fetchMatches=async()=>{
      const res=await API.get("/api/cricket/live");
       setmatches(res.data.data);
    };

    useEffect(() => {
    fetchMatches();
    //auto refresh
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);
 
    return (
      <div className="cricket-page">
  <h2 className="cricket-title">
    <span className="live-dot"></span> Live Matches
  </h2>

  <div className="match-grid">
    {matches.map((ind) => (
      <div className="match-card" key={ind.id}>
        <div className="match-header">
          <span className="match-name">{ind.name}</span>
          <span className="live-badge">LIVE</span>
        </div>

        <p className="match-status">{ind.status}</p>

        {ind.score && (
          <div className="scorecard">
            {ind.score.map((sc, i) => (
              <div className="score-row" key={i}>
                <span>{sc.inning}</span>
                <span>{sc.r}/{sc.w} ({sc.o} ov)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

    );
}

export default LiveCricket;
