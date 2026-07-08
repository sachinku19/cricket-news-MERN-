import API from "./News_Api";
import { Match, PlayerProfile, MatchSquadResponse, UserFavorites, UserPreferences } from "../types/cricket";

// Fetch Live Matches
export const fetchLiveMatches = async (): Promise<Match[]> => {
  const res = await API.get("/api/cricket/live");
  return res.data.data || res.data || [];
};

// Fetch Upcoming Matches
export const fetchUpcomingMatches = async (): Promise<Match[]> => {
  const res = await API.get("/api/cricket/upcoming");
  return res.data.data || res.data || [];
};

// Fetch Match Details
export const fetchMatchDetails = async (id: string): Promise<any> => {
  const res = await API.get(`/api/cricket/match/${id}`);
  return res.data.data || res.data;
};

// Fetch Player Details
export const fetchPlayerDetails = async (id: string): Promise<PlayerProfile> => {
  const res = await API.get(`/api/cricket/player/${id}`);
  // Wrap response info
  const rawData = res.data.data || res.data;
  
  // Format statistics if present in raw data
  return {
    id: rawData.id,
    name: rawData.name,
    country: rawData.country,
    role: rawData.role,
    battingStyle: rawData.battingStyle || "N/A",
    bowlingStyle: rawData.bowlingStyle || "N/A",
    placeOfBirth: rawData.placeOfBirth,
    dateOfBirth: rawData.dateOfBirth,
    image: rawData.playerImg || rawData.image,
    stats: rawData.stats || {},
    recentPerformance: rawData.recentPerformance || [],
  };
};

// Fetch Match Squads (Playing XI)
export const fetchMatchSquads = async (id: string): Promise<MatchSquadResponse> => {
  const res = await API.get(`/api/cricket/squad/${id}`);
  return res.data.data || res.data;
};

// Fetch User Bookmarks and Favorites
export const fetchUserFavorites = async (): Promise<UserFavorites> => {
  const res = await API.get("/api/user/favorites");
  return res.data;
};

// Toggle a Bookmark item
export const toggleUserFavorite = async (
  type: "teams" | "players" | "matches",
  targetId: string
): Promise<any> => {
  const res = await API.post("/api/user/favorites/toggle", { type, targetId });
  return res.data;
};

// Update layout user settings
export const updateUserPreferences = async (
  preferences: Partial<UserPreferences>
): Promise<any> => {
  const res = await API.put("/api/user/preferences", { preferences });
  return res.data;
};
