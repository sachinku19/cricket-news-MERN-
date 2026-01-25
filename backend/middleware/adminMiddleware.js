const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin error:", error.message);
    return res.status(500).json({ message: "Admin middleware failed" });
  }
};

module.exports = adminMiddleware;
