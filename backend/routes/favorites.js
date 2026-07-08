const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../model/user");

const router = express.Router();

// GET all favorites and bookmarks
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      favoriteTeams: user.favoriteTeams || [],
      favoritePlayers: user.favoritePlayers || [],
      bookmarkedMatches: user.bookmarkedMatches || [],
      preferences: user.preferences || {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST toggle a favorite or bookmark item
router.post("/favorites/toggle", authMiddleware, async (req, res) => {
  const { type, targetId } = req.body; // type: 'teams' | 'players' | 'matches'
  
  if (!type || !targetId) {
    return res.status(400).json({ message: "Type and targetId are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let fieldName = "";
    if (type === "teams") {
      fieldName = "favoriteTeams";
    } else if (type === "players") {
      fieldName = "favoritePlayers";
    } else if (type === "matches") {
      fieldName = "bookmarkedMatches";
    } else {
      return res.status(400).json({ message: "Invalid type. Must be 'teams', 'players', or 'matches'" });
    }

    const currentArray = user[fieldName] || [];
    const index = currentArray.indexOf(targetId);

    if (index > -1) {
      // Remove item
      currentArray.splice(index, 1);
    } else {
      // Add item
      currentArray.push(targetId);
    }

    user[fieldName] = currentArray;
    await user.save();

    res.json({
      message: `${type.slice(0, -1)} toggled successfully`,
      favoriteTeams: user.favoriteTeams,
      favoritePlayers: user.favoritePlayers,
      bookmarkedMatches: user.bookmarkedMatches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user preferences
router.put("/preferences", authMiddleware, async (req, res) => {
  const { preferences } = req.body;
  if (!preferences) {
    return res.status(400).json({ message: "Preferences object is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.preferences = {
      ...(user.preferences || {}),
      ...preferences,
    };
    await user.save();

    res.json({
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
