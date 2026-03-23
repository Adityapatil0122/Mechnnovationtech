import { verifyAdminToken } from "../lib/auth.js";

export const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Missing admin token." });
  }

  try {
    req.admin = verifyAdminToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired admin token." });
  }
};
