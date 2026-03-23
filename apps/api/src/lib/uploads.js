import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadRoot = path.resolve(__dirname, "../../uploads");
const localTokens = new Map();
const allowedExtensions = [
  ".pdf",
  ".step",
  ".stp",
  ".dxf",
  ".dwg",
  ".zip",
  ".jpg",
  ".jpeg",
  ".png"
];

const supabase = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false }
    })
  : null;

const sanitizeFileName = (value) =>
  value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");

export const isAllowedUpload = (fileName) => {
  const extension = path.extname(fileName || "").toLowerCase();
  return allowedExtensions.includes(extension);
};

export const buildBaseUrl = (req) => {
  const host = req.get("host");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  return env.publicApiUrl || `${protocol}://${host}`;
};

export const createUploadTarget = async ({ fileName, contentType, baseUrl }) => {
  const safeName = sanitizeFileName(fileName || `upload-${Date.now()}`);
  const objectPath = `${Date.now()}-${safeName}`;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.storage
      .from(env.supabaseStorageBucket)
      .createSignedUploadUrl(objectPath);

    if (error) {
      throw error;
    }

    return {
      uploadUrl: data.signedUrl,
      method: "PUT",
      headers: contentType ? { "content-type": contentType } : {},
      fileUrl: `${env.supabaseStorageBucket}:${objectPath}`,
      storageMode: "supabase"
    };
  }

  await fs.mkdir(uploadRoot, { recursive: true });
  const token = crypto.randomUUID();
  localTokens.set(token, {
    filePath: objectPath,
    contentType: contentType || "application/octet-stream",
    createdAt: Date.now()
  });

  return {
    uploadUrl: `${baseUrl}/api/uploads/local/${token}`,
    method: "PUT",
    headers: contentType ? { "content-type": contentType } : {},
    fileUrl: `${baseUrl}/uploads/${objectPath}`,
    storageMode: "local"
  };
};

export const saveLocalUpload = async (token, bodyBuffer) => {
  const tokenData = localTokens.get(token);
  if (!tokenData) {
    return null;
  }

  await fs.mkdir(uploadRoot, { recursive: true });
  const destination = path.join(uploadRoot, tokenData.filePath);
  await fs.writeFile(destination, bodyBuffer);
  localTokens.delete(token);

  return tokenData;
};

export const getUploadRoot = () => uploadRoot;
