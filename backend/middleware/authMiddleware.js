const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    //  Get token from header
    const authHeader = req.headers.authorization;

    //  Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    //  Extract token
    const token = authHeader.split(" ")[1];

    //  Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    //  Attach user to request
    req.user = decoded;

    //  Move to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
