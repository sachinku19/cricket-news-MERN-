const multer = require("multer");
const path = require("path");

// ===== Storage Configuration =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});

// ===== File Filter (Images Only) =====
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;

  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG images are allowed"), false);
  }
};

// ===== Multer Upload =====
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

module.exports = upload;
