const express = require("express");
const cricketAPI = require("../services/cricketApi");

const router = express.Router();

router.get("/live", async (req, res) => {
  try {
    const response = await cricketAPI.get("/currentMatches");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/upcoming",async(req,res)=>{

try{ const response=await cricketAPI.get("/matches");
    res.json(response.data);
}catch(error){
    res.status(500).json({message:error.message});
}
});

router.get("/match/:id", async (req, res) => {
  try {
    const matchId = req.params.id;

    const response = await cricketAPI.get("/match_info", {
      params: { id: matchId }
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch match details" });
  }
});

// Proxy route for player profiles
router.get("/player/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    const response = await cricketAPI.get("/players_info", {
      params: { id: playerId }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch player details" });
  }
});

// Proxy route for match squads / playing XI
router.get("/squad/:id", async (req, res) => {
  try {
    const matchId = req.params.id;
    const response = await cricketAPI.get("/match_squad", {
      params: { id: matchId }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch match squads" });
  }
});

module.exports=router;