import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAdminToken = (admin) =>
  jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      role: "admin"
    },
    env.jwtSecret,
    { expiresIn: "12h" }
  );

export const verifyAdminToken = (token) =>
  jwt.verify(token, env.jwtSecret);
