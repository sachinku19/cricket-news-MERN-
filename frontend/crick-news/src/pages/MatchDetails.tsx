import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMatchDetails, useMatchSquads, useFavorites, useToggleFavorite } from "../hooks/useCricket";
import "../styles/MatchDetails.css";

const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"scorecard" | "squads" | "info">("scorecard");

  const { data: match, isLoading: isMatchLoading, error: matchError } = useMatchDetails(id || "");
  const { data: squadData, isLoading: isSquadLoading } = useMatchSquads(id || "");
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  if (isMatchLoading) {
    return (
      <div className="cricket-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Analyzing scoreboard statistics...</p>
        </div>
      </div>
    );
  }

  if (matchError || !match) {
    return (
      <div className="cricket-container">
        <div className="empty-container">
          <div className="empty-icon">🏏</div>
          <p className="empty-text">Failed to load match scorecard details</p>
          <button className="back-btn" onClick={() => navigate("/live-match")}>Back to Live Matches</button>
        </div>
      </div>
    );
  }

  const isBookmarked = favorites?.bookmarkedMatches?.includes(id || "") || false;

  const handleToggleBookmark = () => {
    if (!id) return;
    toggleFavorite.mutate({ type: "matches", targetId: id });
  };

  // Helper: calculate hypothetical run rate
  const calculateRunRate = (r: number, o: number) => {
    if (!o || o === 0) return "0.00";
    return (r / o).toFixed(2);
  };

  // Fake Win Probability calculator based on names
  const getWinProbability = () => {
    const teams = match.teams || [];
    if (teams.length < 2) return null;
    const nameSum = (match.name || "").charCodeAt(0) + (match.status || "").charCodeAt(0);
    const prob1 = 45 + (nameSum % 15);
    const prob2 = 100 - prob1;
    return {
      team1: teams[0],
      prob1,
      team2: teams[1],
      prob2
    };
  };

  const probability = getWinProbability();

  return (
    <div className="cricket-container">
      <div className="bg-spotlight"></div>

      <div className="match-detail-header-wrapper">
        <button className="back-link" onClick={() => navigate(-1)}>
          <span>← Back</span>
        </button>
        <button 
          className={`bookmark-toggle-btn ${isBookmarked ? "active" : ""}`}
          onClick={handleToggleBookmark}
        >
          {isBookmarked ? "★ Bookmarked" : "☆ Bookmark Match"}
        </button>
      </div>

      {/* Match Title Card banner */}
      <div className="match-banner-card">
        <div className="match-banner-meta">
          <span className="banner-type-badge">{match.matchType}</span>
          <span className="banner-venue">{match.venue}</span>
        </div>

        <h1 className="banner-teams">{match.teams?.join(" vs ")}</h1>
        <p className="banner-status">{match.status}</p>

        {/* Live Score Display */}
        {match.score && match.score.length > 0 && (
          <div className="banner-scores-box">
            {match.score.map((sc: any, idx: number) => (
              <div className="banner-score-row" key={idx}>
                <span className="banner-inning-lbl">{sc.inning}</span>
                <span className="banner-inning-score">
                  {sc.r}/{sc.w} <small>({sc.o} ov)</small>
                </span>
                <span className="banner-rr">CRR: {calculateRunRate(sc.r, sc.o)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Win Probability Bar Graph */}
        {probability && (
          <div className="win-probability-section">
            <h4 className="win-prob-title">Win Probability</h4>
            <div className="win-prob-bar-container">
              <div className="win-prob-fill team-1" style={{ width: `${probability.prob1}%` }}>
                {probability.prob1}%
              </div>
              <div className="win-prob-fill team-2" style={{ width: `${probability.prob2}%` }}>
                {probability.prob2}%
              </div>
            </div>
            <div className="win-prob-labels">
              <span>{probability.team1}</span>
              <span>{probability.team2}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs bar */}
      <div className="match-tabs-bar">
        <button 
          className={`tab-btn ${activeTab === "scorecard" ? "active" : ""}`}
          onClick={() => setActiveTab("scorecard")}
        >
          Scorecard
        </button>
        <button 
          className={`tab-btn ${activeTab === "squads" ? "active" : ""}`}
          onClick={() => setActiveTab("squads")}
        >
          Playing XI
        </button>
        <button 
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Match Info
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-panel-container">
        {activeTab === "scorecard" && (
          <div className="scorecard-panel">
            {match.score && match.score.length > 0 ? (
              <div className="inning-details-box">
                {match.score.map((sc: any, idx: number) => (
                  <div className="inning-detail-card" key={idx}>
                    <h3 className="inning-card-title">{sc.inning} Scorecard</h3>
                    <div className="score-summary-grid">
                      <div className="metric">
                        <span className="lbl">Total Runs</span>
                        <span className="val">{sc.r}</span>
                      </div>
                      <div className="metric">
                        <span className="lbl">Wickets Fallen</span>
                        <span className="val">{sc.w}</span>
                      </div>
                      <div className="metric">
                        <span className="lbl">Overs Played</span>
                        <span className="val">{sc.o}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <p>Full batsman statistics and bowling figures will show once the match commences.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "squads" && (
          <div className="squads-panel">
            {isSquadLoading ? (
              <div className="spinner-small"></div>
            ) : squadData?.squad && squadData.squad.length > 0 ? (
              <div className="squads-grid-box">
                {squadData.squad.map((team: any, idx: number) => (
                  <div className="team-squad-card" key={idx}>
                    <h3 className="team-squad-title">{team.teamName} Roster</h3>
                    <ul className="squad-players-list">
                      {team.players?.map((player: any) => (
                        <li 
                          key={player.id} 
                          className="player-row-clickable"
                          onClick={() => navigate(`/player/${player.id}`)}
                        >
                          <div className="p-details">
                            <span className="p-name">{player.name}</span>
                            <span className="p-role">{player.role || "Squad Member"}</span>
                          </div>
                          <span className="view-profile-arrow">➔</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <p>Official playing squads have not been registered by teams yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "info" && (
          <div className="info-panel">
            <div className="info-grid-card">
              <h3 className="info-title">Fixture Information</h3>
              <div className="info-row">
                <span className="lbl">Event Name</span>
                <span className="val">{match.name}</span>
              </div>
              <div className="info-row">
                <span className="lbl">Venue Location</span>
                <span className="val">{match.venue}</span>
              </div>
              <div className="info-row">
                <span className="lbl">Scheduled Time</span>
                <span className="val">{new Date(match.dateTimeGMT).toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span className="lbl">Status Description</span>
                <span className="val">{match.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
