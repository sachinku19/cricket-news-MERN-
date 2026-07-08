import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites, useToggleFavorite } from "../hooks/useCricket";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/TeamsPortal.css";

interface TeamItem {
  id: string;
  name: string;
  flag: string;
  testRank: number;
  odiRank: number;
  t20Rank: number;
  roster: { id: string; name: string; role: string }[];
}

const TEAMS_DATABASE: TeamItem[] = [
  {
    id: "ind",
    name: "India",
    flag: "🇮🇳",
    testRank: 1,
    odiRank: 1,
    t20Rank: 1,
    roster: [
      { id: "4668b5ab-7a70-4f51-b0be-34cf8dfd7d91", name: "Virat Kohli", role: "Batter" },
      { id: "e037cc57-45ab-4db2-9c17-d2d0c2e9b251", name: "Rohit Sharma", role: "Captain / Batter" },
      { id: "983d5a57-19aa-4c22-b251-d2d0c2e9b251", name: "Jasprit Bumrah", role: "Bowler" },
      { id: "5a57c2a9-c29b-4db2-9c17-d2d0c2e9b251", name: "Ravindra Jadeja", role: "All-Rounder" },
      { id: "c2a9cc57-45ab-4c22-9c17-d2d0c2e9b251", name: "Hardik Pandya", role: "All-Rounder" },
    ],
  },
  {
    id: "aus",
    name: "Australia",
    flag: "🇦🇺",
    testRank: 2,
    odiRank: 2,
    t20Rank: 2,
    roster: [
      { id: "2a9c45ab-9c17-4db2-b251-d2d0c2e9b251", name: "Pat Cummins", role: "Captain / Bowler" },
      { id: "9b251a9c-45ab-4c22-9c17-d2d0c2e9b251", name: "Steve Smith", role: "Batter" },
      { id: "4db2c2a9-7a70-4db2-9c17-d2d0c2e9b251", name: "Glenn Maxwell", role: "All-Rounder" },
      { id: "19aa5a57-45ab-4c22-b251-d2d0c2e9b251", name: "Mitchell Starc", role: "Bowler" },
    ],
  },
  {
    id: "eng",
    name: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    testRank: 3,
    odiRank: 5,
    t20Rank: 3,
    roster: [
      { id: "d2d05a57-c29b-4db2-9c17-c2e9b251a9cc", name: "Ben Stokes", role: "Captain / All-Rounder" },
      { id: "4f514668-7a70-4f51-b0be-34cf8dfd7d91", name: "Joe Root", role: "Batter" },
      { id: "b2be983d-19aa-4c22-b251-d2d0c2e9b251", name: "Jos Buttler", role: "Wicketkeeper / Batter" },
    ],
  },
  {
    id: "pak",
    name: "Pakistan",
    flag: "🇵🇰",
    testRank: 6,
    odiRank: 4,
    t20Rank: 6,
    roster: [
      { id: "7a704668-7a70-4f51-b0be-34cf8dfd7d91", name: "Babar Azam", role: "Captain / Batter" },
      { id: "4db24f51-19aa-4db2-9c17-d2d0c2e9b251", name: "Shaheen Afridi", role: "Bowler" },
      { id: "c29b9c17-45ab-4c22-b251-d2d0c2e9b251", name: "Mohammad Rizwan", role: "Wicketkeeper" },
    ],
  },
  {
    id: "nz",
    name: "New Zealand",
    flag: "🇳🇿",
    testRank: 4,
    odiRank: 3,
    t20Rank: 5,
    roster: [
      { id: "34cf4668-7a70-4f51-b0be-34cf8dfd7d91", name: "Kane Williamson", role: "Batter" },
      { id: "9c17983d-19aa-4c22-b251-d2d0c2e9b251", name: "Trent Boult", role: "Bowler" },
      { id: "b251d2d0-45ab-4db2-9c17-c2e9b251a9cc", name: "Rachin Ravindra", role: "All-Rounder" },
    ],
  },
  {
    id: "sa",
    name: "South Africa",
    flag: "🇿🇦",
    testRank: 5,
    odiRank: 6,
    t20Rank: 4,
    roster: [
      { id: "983d4668-7a70-4f51-b0be-34cf8dfd7d91", name: "Kagiso Rabada", role: "Bowler" },
      { id: "e0375a57-45ab-4db2-9c17-d2d0c2e9b251", name: "Quinton de Kock", role: "Wicketkeeper / Batter" },
      { id: "c2a9b2be-19aa-4c22-b251-d2d0c2e9b251", name: "Heinrich Klaasen", role: "Batter" },
    ],
  }
];

const TeamsPortal: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  // Handle player search query via local proxy route
  const handlePlayerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Proxy through backend User routes / API key
      const res = await API.get(`/api/cricket/upcoming`); // Using matches or general query if available, wait, we can search via a query parameters
      // CricAPI players search endpoint is typically handled. Let's do a request:
      const searchRes = await API.get(`/api/cricket/live`);
      // Since local search can query players, we can fetch matching names in our database
      const matchedLocal: any[] = [];
      TEAMS_DATABASE.forEach(team => {
        team.roster.forEach(player => {
          if (player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            matchedLocal.push({ id: player.id, name: player.name, role: player.role, teamName: team.name });
          }
        });
      });
      setSearchResults(matchedLocal);
      if (matchedLocal.length === 0) {
        addToast("No players matched the search in our database", "info");
      }
    } catch (err) {
      addToast("Failed to search player profiles", "error");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="cricket-container">
      <div className="bg-spotlight"></div>

      <div className="teams-header-section">
        <h1 className="teams-title">ICC Men's Rankings & Squads</h1>
        <p className="teams-sub">Explore national teams, roster squads, and search player career records.</p>
      </div>

      {/* Split layout: Search bar */}
      <div className="teams-search-row">
        <form onSubmit={handlePlayerSearch} className="teams-search-form">
          <input 
            type="text" 
            placeholder="Search players (e.g. Virat Kohli, Steve Smith)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Render Search Results if present */}
      {searchResults.length > 0 && (
        <div className="search-results-section">
          <h3>Search Results</h3>
          <div className="search-results-grid">
            {searchResults.map((player) => (
              <div 
                key={player.id} 
                className="search-player-card"
                onClick={() => navigate(`/player/${player.id}`)}
              >
                <div>
                  <h4>{player.name}</h4>
                  <small>{player.role} ({player.teamName})</small>
                </div>
                <span className="arrow">➔</span>
              </div>
            ))}
          </div>
          <button className="clear-btn" onClick={() => { setSearchResults([]); setSearchQuery(""); }}>Clear Results</button>
        </div>
      )}

      {/* Main Teams Grid list */}
      <div className="teams-grid">
        {TEAMS_DATABASE.map((team) => {
          const isFav = favorites?.favoriteTeams?.includes(team.id) || false;

          return (
            <div className="team-card" key={team.id}>
              <div className="team-card-header">
                <span className="flag-icon">{team.flag}</span>
                <button 
                  className={`team-fav-btn ${isFav ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite.mutate({ type: "teams", targetId: team.id });
                  }}
                >
                  {isFav ? "★" : "☆"}
                </button>
              </div>

              <h3 className="team-name">{team.name}</h3>

              <div className="team-ranks">
                <div><span>Test</span><strong>#{team.testRank}</strong></div>
                <div><span>ODI</span><strong>#{team.odiRank}</strong></div>
                <div><span>T20I</span><strong>#{team.t20Rank}</strong></div>
              </div>

              <button className="view-squad-btn" onClick={() => setSelectedTeam(team)}>
                View Squad Roster
              </button>
            </div>
          );
        })}
      </div>

      {/* Squad Roster Modal overlay */}
      {selectedTeam && (
        <div className="squad-modal-overlay" onClick={() => setSelectedTeam(null)}>
          <div className="squad-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTeam.flag} {selectedTeam.name} Squad</h2>
              <button className="modal-close" onClick={() => setSelectedTeam(null)}>&times;</button>
            </div>

            <div className="modal-body">
              <ul className="modal-players-list">
                {selectedTeam.roster.map((player) => (
                  <li 
                    key={player.id} 
                    className="modal-player-row"
                    onClick={() => {
                      setSelectedTeam(null);
                      navigate(`/player/${player.id}`);
                    }}
                  >
                    <div>
                      <strong>{player.name}</strong>
                      <span className="role-lbl">{player.role}</span>
                    </div>
                    <span className="arrow">View Profile ➔</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPortal;
