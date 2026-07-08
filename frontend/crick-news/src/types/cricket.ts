export interface Score {
  r: number; // runs
  w: number; // wickets
  o: number; // overs
  inning: string; // e.g. "India Inning 1"
}

export interface Match {
  id: string;
  name: string;
  matchType: "t20" | "odi" | "test" | "hosts";
  status: string;
  venue: string;
  date: string; // "YYYY-MM-DD"
  dateTimeGMT: string;
  teams: string[]; // ["India", "Australia"]
  score?: Score[];
  series_id?: string;
  fantasyEnabled?: boolean;
  bbbEnabled?: boolean;
  hasSquad?: boolean;
}

export interface PlayerStatsDetail {
  m: string; // matches
  inn: string; // innings
  no: string; // not outs
  runs: string;
  hs: string; // highest score
  avg: string; // average
  bf: string; // balls faced
  sr: string; // strike rate
  "100s": string;
  "200s": string;
  "50s": string;
  "4s": string;
  "6s": string;
  // Bowling specific fields
  wkts?: string;
  bbi?: string; // best bowling innings
  bbm?: string; // best bowling match
  econ?: string; // economy
  w5?: string; // 5-wicket hauls
  w10?: string; // 10-wicket hauls
}

export interface PlayerStats {
  batting: {
    [format: string]: PlayerStatsDetail; // e.g. "ODIs", "T20Is", "Tests"
  };
  bowling: {
    [format: string]: PlayerStatsDetail;
  };
}

export interface PlayerProfile {
  id: string;
  name: string;
  country: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  image?: string;
  stats?: PlayerStats;
  recentPerformance?: string[];
}

export interface SquadPlayer {
  id: string;
  name: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  image?: string;
}

export interface TeamSquad {
  teamName: string;
  players: SquadPlayer[];
}

export interface MatchSquadResponse {
  matchName: string;
  squad: TeamSquad[];
}

export interface UserPreferences {
  theme: "dark" | "light";
  notifications: boolean;
  favoriteTeam?: string;
}

export interface UserFavorites {
  favoriteTeams: string[];
  favoritePlayers: string[];
  bookmarkedMatches: string[];
  preferences: UserPreferences;
}
