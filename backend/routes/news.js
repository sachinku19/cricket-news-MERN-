const express = require("express");
const router = express.Router();

const {
  addNews,
  getAllnews,
  single_news,
  update_news,
  delete_news,
} = require("../controller/news");

const upload = require("../middleware/image_upload");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ADD NEWS (ADMIN)
router.post(
  "/add-news",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addNews
);

// GET ALL NEWS (PUBLIC)
router.get("/", getAllnews);

// GET SINGLE NEWS (PUBLIC)
router.get("/:id", single_news);

// UPDATE NEWS (ADMIN)
router.put(
  "/edit-news/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  update_news
);

// DELETE NEWS (ADMIN)
router.delete(
  "/delete-news/:id",
  authMiddleware,
  adminMiddleware,
  delete_news
);

module.exports = router;
