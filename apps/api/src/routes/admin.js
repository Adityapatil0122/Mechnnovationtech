import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../middleware/require-admin.js";
import { signAdminToken } from "../lib/auth.js";
import { leadStatuses, store, storeMode } from "../lib/store.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  sort_order: z.union([z.number(), z.string()]).optional(),
  is_active: z.boolean().optional()
});

const productSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  specs_json: z.record(z.any()).optional(),
  primary_image_url: z.string().optional(),
  gallery_urls_json: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional()
});

const statusSchema = z.object({
  status: z.enum(leadStatuses),
  internal_notes: z.string().optional(),
  follow_up_at: z.string().optional()
});

const siteContentSchema = z.object({
  id: z.string().optional(),
  page_key: z.string().min(1),
  section_key: z.string().min(1),
  title: z.string().optional(),
  body: z.string().optional(),
  meta_json: z.record(z.any()).optional()
});

const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  company: z.string().optional(),
  quote: z.string().min(3),
  is_active: z.boolean().optional(),
  sort_order: z.union([z.number(), z.string()]).optional()
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const admin = await store.authenticateAdmin(payload.email, payload.password);

    if (!admin) {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    return res.json({
      token: signAdminToken(admin),
      admin,
      storeMode
    });
  } catch (error) {
    return next(error);
  }
});

router.use(requireAdmin);

router.get("/dashboard", async (_req, res, next) => {
  try {
    const dashboard = await store.getDashboard();
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await store.listCategories({ includeInactive: true });
    res.json({ items: categories });
  } catch (error) {
    next(error);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const payload = categorySchema.parse(req.body);
    const category = await store.upsertCategory(payload);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.patch("/categories/:id", async (req, res, next) => {
  try {
    const payload = categorySchema.parse({ ...req.body, id: req.params.id });
    const category = await store.upsertCategory(payload);
    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete("/categories/:id", async (req, res, next) => {
  try {
    await store.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/products", async (_req, res, next) => {
  try {
    const result = await store.listProducts({ includeInactive: true, pageSize: 100 });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const payload = productSchema.parse(req.body);
    const product = await store.upsertProduct(payload);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.patch("/products/:id", async (req, res, next) => {
  try {
    const payload = productSchema.parse({ ...req.body, id: req.params.id });
    const product = await store.upsertProduct(payload);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    await store.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/enquiries", async (_req, res, next) => {
  try {
    const items = await store.listEnquiries();
    res.json({ items, statuses: leadStatuses });
  } catch (error) {
    next(error);
  }
});

router.patch("/enquiries/:id", async (req, res, next) => {
  try {
    const payload = statusSchema.parse(req.body);
    const enquiry = await store.updateEnquiry(req.params.id, payload);
    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found." });
    }

    return res.json(enquiry);
  } catch (error) {
    return next(error);
  }
});

router.get("/service-requests", async (_req, res, next) => {
  try {
    const items = await store.listServiceRequests();
    res.json({ items, statuses: leadStatuses });
  } catch (error) {
    next(error);
  }
});

router.patch("/service-requests/:id", async (req, res, next) => {
  try {
    const payload = statusSchema.parse(req.body);
    const request = await store.updateServiceRequest(req.params.id, payload);
    if (!request) {
      return res.status(404).json({ error: "Service request not found." });
    }

    return res.json(request);
  } catch (error) {
    return next(error);
  }
});

router.get("/site-content", async (_req, res, next) => {
  try {
    const items = await store.listSiteContent();
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.post("/site-content", async (req, res, next) => {
  try {
    const payload = siteContentSchema.parse(req.body);
    const item = await store.upsertSiteContent(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.patch("/site-content/:id", async (req, res, next) => {
  try {
    const payload = siteContentSchema.parse({ ...req.body, id: req.params.id });
    const item = await store.upsertSiteContent(payload);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.get("/testimonials", async (_req, res, next) => {
  try {
    const items = await store.listTestimonials();
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.post("/testimonials", async (req, res, next) => {
  try {
    const payload = testimonialSchema.parse(req.body);
    const item = await store.upsertTestimonial(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.patch("/testimonials/:id", async (req, res, next) => {
  try {
    const payload = testimonialSchema.parse({ ...req.body, id: req.params.id });
    const item = await store.upsertTestimonial(payload);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/testimonials/:id", async (req, res, next) => {
  try {
    await store.deleteTestimonial(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
