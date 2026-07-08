import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayerProfile, useFavorites, useToggleFavorite } from "../hooks/useCricket";
import "../styles/PlayerProfile.css";

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: player, isLoading, error } = usePlayerProfile(id || "");
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  if (isLoading) {
    return (
      <div className="cricket-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Gathering career biography stats...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="cricket-container">
        <div className="empty-container">
          <div className="empty-icon">👤</div>
          <p className="empty-text">Failed to load player career profile</p>
          <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites?.favoritePlayers?.includes(id || "") || false;

  const handleToggleFavorite = () => {
    if (!id) return;
    toggleFavorite.mutate({ type: "players", targetId: id });
  };

  // Helper to render stats table keys mapping
  const renderStatsRows = (statsObj: any) => {
    if (!statsObj || Object.keys(statsObj).length === 0) {
      return (
        <tr>
          <td colSpan={10} className="stats-empty-row">No records available</td>
        </tr>
      );
    }

    return Object.entries(statsObj).map(([format, data]: [string, any]) => (
      <tr key={format}>
        <td className="stat-format-col">{format}</td>
        <td>{data.m || "—"}</td>
        <td>{data.inn || "—"}</td>
        <td>{data.runs || "—"}</td>
        <td>{data.hs || "—"}</td>
        <td>{data.avg || "—"}</td>
        <td>{data.sr || "—"}</td>
        <td>{data["100s"] || data["100"] || "0"}</td>
        <td>{data["50s"] || data["50"] || "0"}</td>
        <td>{data["4s"] || "—"}</td>
      </tr>
    ));
  };

  const renderBowlingRows = (statsObj: any) => {
    if (!statsObj || Object.keys(statsObj).length === 0) {
      return (
        <tr>
          <td colSpan={8} className="stats-empty-row">No records available</td>
        </tr>
      );
    }

    return Object.entries(statsObj).map(([format, data]: [string, any]) => (
      <tr key={format}>
        <td className="stat-format-col">{format}</td>
        <td>{data.m || "—"}</td>
        <td>{data.inn || "—"}</td>
        <td>{data.wkts || "—"}</td>
        <td>{data.econ || "—"}</td>
        <td>{data.avg || "—"}</td>
        <td>{data.bbi || "—"}</td>
        <td>{data.w5 || "0"}</td>
      </tr>
    ));
  };

  return (
    <div className="cricket-container">
      <div className="bg-spotlight"></div>

      <div className="player-profile-header-wrapper">
        <button className="back-link" onClick={() => navigate(-1)}>
          <span>← Back</span>
        </button>
        <button 
          className={`favorite-toggle-btn ${isFavorite ? "active" : ""}`}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "★ Favorite Player" : "☆ Add Favorite"}
        </button>
      </div>

      {/* Main Profile Info Card banner */}
      <div className="player-banner-card">
        <div className="player-avatar-large">
          {player.image ? (
            <img src={player.image} alt={player.name} className="p-avatar-img" />
          ) : (
            <div className="p-avatar-placeholder">
              <span>{player.name ? player.name.charAt(0) : "P"}</span>
            </div>
          )}
        </div>

        <div className="player-meta-box">
          <span className="player-country-lbl">{player.country}</span>
          <h1 className="player-fullname">{player.name}</h1>
          <span className="player-role-badge">{player.role}</span>
          
          <div className="player-specs-grid">
            <div>
              <small>Batting Style</small>
              <span>{player.battingStyle}</span>
            </div>
            <div>
              <small>Bowling Style</small>
              <span>{player.bowlingStyle}</span>
            </div>
            {player.dateOfBirth && (
              <div>
                <small>Born</small>
                <span>{player.dateOfBirth}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Section Tables */}
      <div className="player-stats-section">
        <h2 className="section-title">Career Statistics</h2>

        {/* Batting Stats Table */}
        <div className="stats-table-wrapper">
          <h3>Batting Records</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Mat</th>
                <th>Inn</th>
                <th>Runs</th>
                <th>HS</th>
                <th>Avg</th>
                <th>SR</th>
                <th>100s</th>
                <th>50s</th>
                <th>4s</th>
              </tr>
            </thead>
            <tbody>
              {renderStatsRows(player.stats?.batting)}
            </tbody>
          </table>
        </div>

        {/* Bowling Stats Table */}
        <div className="stats-table-wrapper">
          <h3>Bowling Records</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Mat</th>
                <th>Inn</th>
                <th>Wkts</th>
                <th>Econ</th>
                <th>Avg</th>
                <th>BBI</th>
                <th>5W</th>
              </tr>
            </thead>
            <tbody>
              {renderBowlingRows(player.stats?.bowling)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
