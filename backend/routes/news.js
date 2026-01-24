const express = require("express");
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

const router = express.Router();

router.post("/add-news", authMiddleware, adminMiddleware,upload.single("image"), addNews);
router.get("/", getAllnews);
router.get("/:id", single_news);
router.put("/edit-news/:id", authMiddleware, adminMiddleware,upload.single("image"), update_news);
router.delete("/delete-news/:id", authMiddleware, adminMiddleware, delete_news);

module.exports = router;
