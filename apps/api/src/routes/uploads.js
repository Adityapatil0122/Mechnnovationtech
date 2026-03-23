import { Router, raw } from "express";
import { z } from "zod";
import {
  buildBaseUrl,
  createUploadTarget,
  isAllowedUpload,
  saveLocalUpload
} from "../lib/uploads.js";

const router = Router();

const signSchema = z.object({
  fileName: z.string().min(3),
  contentType: z.string().optional()
});

router.post("/sign", async (req, res, next) => {
  try {
    const payload = signSchema.parse(req.body);

    if (!isAllowedUpload(payload.fileName)) {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    const target = await createUploadTarget({
      fileName: payload.fileName,
      contentType: payload.contentType,
      baseUrl: buildBaseUrl(req)
    });

    return res.json(target);
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/local/:token",
  raw({ type: "*/*", limit: "25mb" }),
  async (req, res, next) => {
    try {
      const saved = await saveLocalUpload(req.params.token, req.body);
      if (!saved) {
        return res.status(404).json({ error: "Upload token not found." });
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
