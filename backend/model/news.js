const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // image URL or filename
      required: true,
    },

    category: {
      type: String,
      enum: ["Match", "Player", "Team", "Tournament"],
      default: "Match",
    },

    author: {
      type: String,
      default: "Admin",
    },

    // isPublished: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  { timestamps: true },
);


module.exports=mongoose.model("News",newsSchema);