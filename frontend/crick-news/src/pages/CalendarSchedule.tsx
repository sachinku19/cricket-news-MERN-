import React, { useState } from "react";
import { useUpcomingMatches, useFavorites, useToggleFavorite } from "../hooks/useCricket";
import getCountdown from "../utils/getCountdown";
import "../styles/CalendarSchedule.css";

const CalendarSchedule: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: matches, isLoading, error } = useUpcomingMatches();
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  if (isLoading) {
    return (
      <div className="cricket-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Compiling future match calendars...</p>
        </div>
      </div>
    );
  }

  if (error || !matches) {
    return (
      <div className="cricket-container">
        <div className="empty-container">
          <div className="empty-icon">📅</div>
          <p className="empty-text">Failed to fetch upcoming schedule</p>
        </div>
      </div>
    );
  }

  // Filter matches based on format and search query
  const filteredMatches = matches.filter((match) => {
    const formatMatch = selectedFormat === "all" || match.matchType?.toLowerCase() === selectedFormat;
    const nameMatch = match.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      match.venue?.toLowerCase().includes(searchQuery.toLowerCase());
    return formatMatch && nameMatch;
  });

  return (
    <div className="cricket-container">
      <div className="bg-spotlight"></div>

      <div className="schedule-header-wrapper">
        <div className="schedule-meta">
          <h1 className="schedule-title">Match Calendar</h1>
          <p className="schedule-subtitle">Stay tuned with schedules of upcoming leagues and bilateral series.</p>
        </div>
        
        {/* Search Input bar */}
        <div className="schedule-search-box">
          <input 
            type="text" 
            placeholder="Search teams or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="schedule-search"
          />
        </div>
      </div>

      {/* Format Filter Tabs */}
      <div className="schedule-filter-bar">
        {["all", "t20", "odi", "test"].map((format) => (
          <button
            key={format}
            className={`filter-tab-btn ${selectedFormat === format ? "active" : ""}`}
            onClick={() => setSelectedFormat(format)}
          >
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Fixtures List */}
      {filteredMatches.length === 0 ? (
        <div className="empty-container">
          <div className="empty-icon">📅</div>
          <p className="empty-text">No matching upcoming fixtures found.</p>
        </div>
      ) : (
        <div className="schedule-grid">
          {filteredMatches.map((match) => {
            const countdown = getCountdown(match.dateTimeGMT);
            const isBookmarked = favorites?.bookmarkedMatches?.includes(match.id) || false;

            return (
              <div className="schedule-card" key={match.id}>
                <div className="schedule-card-header">
                  <span className="series-tag">{match.matchType?.toUpperCase() || "Fixture"}</span>
                  <button 
                    className={`remind-btn ${isBookmarked ? "active" : ""}`}
                    onClick={() => toggleFavorite.mutate({ type: "matches", targetId: match.id })}
                  >
                    {isBookmarked ? "★ Reminding" : "☆ Remind Me"}
                  </button>
                </div>

                <h3 className="schedule-match-name">{match.name}</h3>
                
                <div className="schedule-card-body">
                  <div className="schedule-detail-row">
                    <span className="lbl">📅 Date</span>
                    <span className="val">{new Date(match.dateTimeGMT).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="schedule-detail-row">
                    <span className="lbl">🕒 Time</span>
                    <span className="val">{new Date(match.dateTimeGMT).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="schedule-detail-row">
                    <span className="lbl">📍 Venue</span>
                    <span className="val">{match.venue}</span>
                  </div>
                </div>

                {countdown ? (
                  <div className="schedule-countdown-wrapper">
                    <span className="starts-in-lbl">Countdown:</span>
                    <div className="schedule-countdown">
                      <div className="countdown-cell">
                        <span>{countdown.days}</span>
                        <small>d</small>
                      </div>
                      <div className="countdown-cell">
                        <span>{countdown.hours}</span>
                        <small>h</small>
                      </div>
                      <div className="countdown-cell">
                        <span>{countdown.minutes}</span>
                        <small>m</small>
                      </div>
                      <div className="countdown-cell">
                        <span>{countdown.seconds}</span>
                        <small>s</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="schedule-starts-soon">
                    <span>Starting Imminently</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarSchedule;
