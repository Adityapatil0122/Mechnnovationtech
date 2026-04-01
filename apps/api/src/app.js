import express from "express";
import cors from "cors";
import { ZodError } from "zod";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/uploads.js";
import { env } from "./config/env.js";
import { getUploadRoot } from "./lib/uploads.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: false
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use("/uploads", express.static(getUploadRoot()));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "mechnnovation-api" });
  });

  app.use("/api", publicRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use((error, _req, res, _next) => {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: error.flatten() });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  });

  return app;
};
