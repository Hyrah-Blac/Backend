import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export default (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ message: "🚫 No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "🚫 Access denied" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "🚫 Invalid or expired token" });
  }
};