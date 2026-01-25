const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// ===== Cloudinary Config =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== Cloudinary Storage =====
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cricket-news",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => {
      return Date.now() + "_" + file.originalname.split(".")[0];
    },
  },
});

// ===== Multer Upload =====
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB (same as before)
  },
});

module.exports = upload;
