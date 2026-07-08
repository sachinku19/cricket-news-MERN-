const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  favoriteTeams: {
    type: [String],
    default: [],
  },
  favoritePlayers: {
    type: [String],
    default: [],
  },
  bookmarkedMatches: {
    type: [String],
    default: [],
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      theme: "dark",
      notifications: true,
    },
  },
},{timestamps:true});

module.exports=mongoose.model("User",UserSchema);
