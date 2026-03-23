import { Router } from "express";
import { z } from "zod";
import { store } from "../lib/store.js";

const router = Router();

const optionalStringish = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) =>
    value === undefined || value === null || value === "" ? undefined : String(value)
  );

const enquirySchema = z.object({
  product_id: z.string().optional().nullable(),
  name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().min(6),
  email: z.string().email(),
  quantity: optionalStringish,
  message: z.string().min(5),
  file_url: z.string().optional()
});

const serviceRequestSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().min(6),
  email: z.string().email(),
  work_type: z.string().min(2),
  material: z.string().optional(),
  quantity: optionalStringish,
  deadline: z.string().optional(),
  file_url: z.string().optional(),
  notes: z.string().optional()
});

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await store.listCategories();
    res.json({ items: categories });
  } catch (error) {
    next(error);
  }
});

router.get("/products", async (req, res, next) => {
  try {
    const result = await store.listProducts({
      search: String(req.query.search || ""),
      category: String(req.query.category || ""),
      featured: String(req.query.featured || "false") === "true",
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || 12)
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/products/:slug", async (req, res, next) => {
  try {
    const product = await store.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.get("/site-content/:pageKey", async (req, res, next) => {
  try {
    const payload = await store.getPageContent(req.params.pageKey);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.post("/enquiries", async (req, res, next) => {
  try {
    const payload = enquirySchema.parse(req.body);
    const enquiry = await store.createEnquiry(payload);
    res.status(201).json(enquiry);
  } catch (error) {
    next(error);
  }
});

router.post("/service-requests", async (req, res, next) => {
  try {
    const payload = serviceRequestSchema.parse(req.body);
    const request = await store.createServiceRequest(payload);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

export default router;
