import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchLiveMatches,
  fetchUpcomingMatches,
  fetchMatchDetails,
  fetchPlayerDetails,
  fetchMatchSquads,
  fetchUserFavorites,
  toggleUserFavorite,
  updateUserPreferences
} from "../services/cricketApi";

// Hook: Live Matches (w/ smart polling)
export const useLiveMatches = () => {
  return useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    // Poll every 30 seconds only if matches are actively live
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.length > 0) {
        // If there's at least one match not completed, poll
        const hasActiveMatch = data.some(
          (match) => 
            !match.status?.toLowerCase().includes("won") && 
            !match.status?.toLowerCase().includes("draw") &&
            !match.status?.toLowerCase().includes("abandoned")
        );
        return hasActiveMatch ? 30000 : false;
      }
      return false;
    },
    staleTime: 15000, // Caches as fresh for 15s to allow fast manual reload
  });
};

// Hook: Upcoming Matches
export const useUpcomingMatches = () => {
  return useQuery({
    queryKey: ["upcomingMatches"],
    queryFn: fetchUpcomingMatches,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// Hook: Match Details (scores + stats)
export const useMatchDetails = (id: string) => {
  return useQuery({
    queryKey: ["matchDetails", id],
    queryFn: () => fetchMatchDetails(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      // If match is live (not completed), poll every 30s
      if (data) {
        const isLive = !data.status?.toLowerCase().includes("won") && 
                       !data.status?.toLowerCase().includes("draw") &&
                       !data.status?.toLowerCase().includes("abandoned");
        return isLive ? 30000 : false;
      }
      return false;
    },
    staleTime: 10000,
  });
};

// Hook: Match Squads (Playing XI)
export const useMatchSquads = (id: string) => {
  return useQuery({
    queryKey: ["matchSquads", id],
    queryFn: () => fetchMatchSquads(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 mins cache since squads rarely change during play
  });
};

// Hook: Player Career Biography Profile
export const usePlayerProfile = (id: string) => {
  return useQuery({
    queryKey: ["playerProfile", id],
    queryFn: () => fetchPlayerDetails(id),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching since career stats change slowly
  });
};

// Hook: User Favorites
export const useFavorites = () => {
  const auth = useContext(AuthContext);
  const isAuthenticated = !!auth?.token;

  return useQuery({
    queryKey: ["userFavorites"],
    queryFn: fetchUserFavorites,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// Hook: Mutation to Toggle Favorite/Bookmark
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, targetId }: { type: "teams" | "players" | "matches"; targetId: string }) =>
      toggleUserFavorite(type, targetId),
    onSuccess: (data) => {
      // Optimistically update query client cache list
      queryClient.setQueryData(["userFavorites"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          favoriteTeams: data.favoriteTeams,
          favoritePlayers: data.favoritePlayers,
          bookmarkedMatches: data.bookmarkedMatches,
        };
      });
    },
  });
};

// Hook: Mutation to Update Layout preferences
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: any) => updateUserPreferences(preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(["userFavorites"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          preferences: data.preferences,
        };
      });
    },
  });
};
