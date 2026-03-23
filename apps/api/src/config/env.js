import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const parseNumber = (value, fallback) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseNumber(process.env.PORT, 4000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  publicApiUrl: process.env.PUBLIC_API_URL || "http://localhost:4000",
  jwtSecret: process.env.JWT_SECRET || "change-mechnnovation-admin-secret",
  adminEmail: process.env.ADMIN_EMAIL || "admin@mechnnovation.local",
  adminPassword: process.env.ADMIN_PASSWORD || "ChangeMe123!",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || "uploads",
  uploadMaxBytes: parseNumber(process.env.UPLOAD_MAX_BYTES, 20 * 1024 * 1024)
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseServiceRoleKey);
