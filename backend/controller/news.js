const News = require("../model/news");

// ================= ADD NEWS =================
const addNews = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const news = await News.create({
      title,
      description,
      category,
      image: req.file.path, // ✅ Cloudinary URL
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL NEWS =================
const getAllnews = async (req, res) => {
  try {
    const newses = await News.find().sort({ createdAt: -1 });
    res.json(newses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SINGLE NEWS =================
const single_news = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE NEWS =================
const update_news = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const updatedData = {
      title: req.body.title || news.title,
      description: req.body.description || news.description,
      category: req.body.category || news.category,
      image: req.file ? req.file.path : news.image, // ✅ FIXED
    };

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE NEWS =================
const delete_news = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    await news.deleteOne();
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {  
  addNews,
  getAllnews,
  single_news,
  update_news,
  delete_news,
};
