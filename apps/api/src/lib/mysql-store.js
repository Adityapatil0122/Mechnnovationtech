import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { env } from "../config/env.js";
import {
  companyProfile,
  leadStatuses
} from "../data/seed.js";

const clone = (v) => JSON.parse(JSON.stringify(v));
const nowIso = () => new Date().toISOString();
const makeId = () => crypto.randomUUID();
const makeSlug = (v) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.mysqlHost,
      port: env.mysqlPort,
      user: env.mysqlUser,
      password: env.mysqlPassword,
      database: env.mysqlDatabase,
      waitForConnections: true,
      connectionLimit: 10,
      charset: "utf8mb4"
    });
  }
  return pool;
}

function parseJson(val) {
  if (!val) return {};
  if (typeof val === "object") return val;
  try { return JSON.parse(val); } catch { return {}; }
}

function parseJsonArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function toBool(val) {
  return val === 1 || val === true || val === "1";
}

function rowToCategory(r) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description || "",
    sort_order: r.sort_order || 0,
    is_active: toBool(r.is_active)
  };
}

function rowToProduct(r) {
  return {
    id: r.id,
    category_id: r.category_id,
    name: r.name,
    slug: r.slug,
    short_description: r.short_description || "",
    description: r.description || "",
    specs_json: parseJson(r.specs_json),
    primary_image_url: r.primary_image_url || "",
    gallery_urls_json: parseJsonArray(r.gallery_urls_json),
    is_featured: toBool(r.is_featured),
    is_active: toBool(r.is_active),
    created_at: r.created_at ? new Date(r.created_at).toISOString() : nowIso()
  };
}

function withCategory(product, categoryMap) {
  return {
    ...product,
    category: categoryMap.get(product.category_id) || null
  };
}

export class MysqlStore {
  constructor() {
    this.db = getPool();
  }

  getCompanyProfile() {
    return clone(companyProfile);
  }

  async authenticateAdmin(email, password) {
    const [rows] = await this.db.execute(
      "SELECT * FROM admin_users WHERE email = ?",
      [email]
    );
    if (!rows.length) return null;
    const admin = rows[0];
    const ok = await bcrypt.compare(password, admin.password_hash);
    return ok ? { id: admin.id, email: admin.email } : null;
  }

  // ── Categories ──

  async listCategories({ includeInactive = false } = {}) {
    const sql = includeInactive
      ? "SELECT * FROM categories ORDER BY sort_order ASC"
      : "SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC";
    const [rows] = await this.db.execute(sql);
    return rows.map(rowToCategory);
  }

  async upsertCategory(payload) {
    const id = payload.id || makeId();
    const name = payload.name;
    const slug = payload.slug || makeSlug(name);
    const description = payload.description || "";
    const sort_order = Number(payload.sort_order || 0);
    const is_active = (payload.is_active ?? true) ? 1 : 0;

    await this.db.execute(
      `INSERT INTO categories (id, name, slug, description, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug),
         description=VALUES(description), sort_order=VALUES(sort_order), is_active=VALUES(is_active)`,
      [id, name, slug, description, sort_order, is_active]
    );

    const [rows] = await this.db.execute("SELECT * FROM categories WHERE id = ?", [id]);
    return rowToCategory(rows[0]);
  }

  async deleteCategory(id) {
    await this.db.execute("DELETE FROM categories WHERE id = ?", [id]);
    return true;
  }

  // ── Products ──

  async listProducts({
    search = "",
    category = "",
    featured = false,
    includeInactive = false,
    page = 1,
    pageSize = 12
  } = {}) {
    const categories = await this.listCategories({ includeInactive: true });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    let where = [];
    let params = [];

    if (!includeInactive) {
      where.push("is_active = 1");
    }
    if (featured) {
      where.push("is_featured = 1");
    }
    if (category) {
      const cat = categories.find((c) => c.slug === category || c.id === category);
      if (cat) {
        where.push("category_id = ?");
        params.push(cat.id);
      } else {
        return { items: [], total: 0 };
      }
    }
    if (search) {
      where.push("(name LIKE ? OR short_description LIKE ? OR description LIKE ?)");
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const whereClause = where.length ? "WHERE " + where.join(" AND ") : "";

    const [countRows] = await this.db.execute(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const offset = (page - 1) * pageSize;
    const [rows] = await this.db.execute(
      `SELECT * FROM products ${whereClause} ORDER BY name ASC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const items = rows.map(rowToProduct).map((p) => withCategory(p, categoryMap));
    return { items, total };
  }

  async getProductBySlug(slug) {
    const categories = await this.listCategories({ includeInactive: true });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const [rows] = await this.db.execute(
      "SELECT * FROM products WHERE slug = ? AND is_active = 1",
      [slug]
    );
    if (!rows.length) return null;

    const product = rowToProduct(rows[0]);

    const [related] = await this.db.execute(
      "SELECT * FROM products WHERE category_id = ? AND id != ? AND is_active = 1 LIMIT 4",
      [product.category_id, product.id]
    );

    return {
      product: withCategory(product, categoryMap),
      related: related.map(rowToProduct).map((p) => withCategory(p, categoryMap))
    };
  }

  async upsertProduct(payload) {
    const id = payload.id || makeId();
    const category_id = payload.category_id;
    const name = payload.name;
    const slug = payload.slug || makeSlug(name);
    const short_description = payload.short_description || "";
    const description = payload.description || "";
    const specs_json = JSON.stringify(payload.specs_json || {});
    const primary_image_url = payload.primary_image_url || "";
    const gallery_urls_json = JSON.stringify(payload.gallery_urls_json || []);
    const is_featured = (payload.is_featured ?? false) ? 1 : 0;
    const is_active = (payload.is_active ?? true) ? 1 : 0;
    const created_at = payload.created_at || nowIso();

    await this.db.execute(
      `INSERT INTO products (id, category_id, name, slug, short_description, description,
        specs_json, primary_image_url, gallery_urls_json, is_featured, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), name=VALUES(name),
         slug=VALUES(slug), short_description=VALUES(short_description),
         description=VALUES(description), specs_json=VALUES(specs_json),
         primary_image_url=VALUES(primary_image_url), gallery_urls_json=VALUES(gallery_urls_json),
         is_featured=VALUES(is_featured), is_active=VALUES(is_active)`,
      [id, category_id, name, slug, short_description, description,
       specs_json, primary_image_url, gallery_urls_json, is_featured, is_active, created_at]
    );

    const [rows] = await this.db.execute("SELECT * FROM products WHERE id = ?", [id]);
    return rowToProduct(rows[0]);
  }

  async deleteProduct(id) {
    await this.db.execute("DELETE FROM products WHERE id = ?", [id]);
    return true;
  }

  // ── Enquiries ──

  async createEnquiry(payload) {
    const id = makeId();
    const created_at = nowIso();
    await this.db.execute(
      `INSERT INTO enquiries (id, product_id, name, company, phone, email, quantity, message, file_url, status, internal_notes, follow_up_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', '', '', ?)`,
      [id, payload.product_id || null, payload.name, payload.company || "",
       payload.phone, payload.email, payload.quantity || "", payload.message || "",
       payload.file_url || "", created_at]
    );
    const [rows] = await this.db.execute("SELECT * FROM enquiries WHERE id = ?", [id]);
    return rows[0];
  }

  async listEnquiries() {
    const [rows] = await this.db.execute("SELECT * FROM enquiries ORDER BY created_at DESC");
    return rows;
  }

  async updateEnquiry(id, payload) {
    const sets = [];
    const params = [];
    for (const key of ["status", "internal_notes", "follow_up_at"]) {
      if (payload[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(payload[key]);
      }
    }
    if (!sets.length) return null;
    params.push(id);
    await this.db.execute(`UPDATE enquiries SET ${sets.join(", ")} WHERE id = ?`, params);
    const [rows] = await this.db.execute("SELECT * FROM enquiries WHERE id = ?", [id]);
    return rows[0] || null;
  }

  // ── Service Requests ──

  async createServiceRequest(payload) {
    const id = makeId();
    const created_at = nowIso();
    await this.db.execute(
      `INSERT INTO service_requests (id, name, company, phone, email, work_type, material, quantity, deadline, file_url, notes, status, internal_notes, follow_up_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', '', '', ?)`,
      [id, payload.name, payload.company || "", payload.phone, payload.email,
       payload.work_type, payload.material || "", payload.quantity || "",
       payload.deadline || "", payload.file_url || "", payload.notes || "", created_at]
    );
    const [rows] = await this.db.execute("SELECT * FROM service_requests WHERE id = ?", [id]);
    return rows[0];
  }

  async listServiceRequests() {
    const [rows] = await this.db.execute("SELECT * FROM service_requests ORDER BY created_at DESC");
    return rows;
  }

  async updateServiceRequest(id, payload) {
    const sets = [];
    const params = [];
    for (const key of ["status", "internal_notes", "follow_up_at"]) {
      if (payload[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(payload[key]);
      }
    }
    if (!sets.length) return null;
    params.push(id);
    await this.db.execute(`UPDATE service_requests SET ${sets.join(", ")} WHERE id = ?`, params);
    const [rows] = await this.db.execute("SELECT * FROM service_requests WHERE id = ?", [id]);
    return rows[0] || null;
  }

  // ── Site Content ──

  async getPageContent(pageKey) {
    const [sections] = await this.db.execute(
      "SELECT * FROM site_content WHERE page_key = ?",
      [pageKey]
    );
    const [testimonials] = await this.db.execute(
      "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC"
    );

    return {
      company: clone(companyProfile),
      sections: sections.map((r) => ({
        ...r,
        meta_json: parseJson(r.meta_json)
      })),
      testimonials: testimonials.map((r) => ({ ...r, is_active: toBool(r.is_active) }))
    };
  }

  async listSiteContent() {
    const [rows] = await this.db.execute("SELECT * FROM site_content ORDER BY page_key ASC");
    return rows.map((r) => ({ ...r, meta_json: parseJson(r.meta_json) }));
  }

  async upsertSiteContent(payload) {
    const id = payload.id || makeId();
    const page_key = payload.page_key;
    const section_key = payload.section_key;
    const title = payload.title || "";
    const body = payload.body || "";
    const meta_json = JSON.stringify(payload.meta_json || {});
    const updated_at = nowIso();

    await this.db.execute(
      `INSERT INTO site_content (id, page_key, section_key, title, body, meta_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE page_key=VALUES(page_key), section_key=VALUES(section_key),
         title=VALUES(title), body=VALUES(body), meta_json=VALUES(meta_json), updated_at=VALUES(updated_at)`,
      [id, page_key, section_key, title, body, meta_json, updated_at]
    );

    const [rows] = await this.db.execute("SELECT * FROM site_content WHERE id = ?", [id]);
    return { ...rows[0], meta_json: parseJson(rows[0].meta_json) };
  }

  async deleteSiteContent(id) {
    await this.db.execute("DELETE FROM site_content WHERE id = ?", [id]);
    return true;
  }

  // ── Testimonials ──

  async listTestimonials() {
    const [rows] = await this.db.execute("SELECT * FROM testimonials ORDER BY sort_order ASC");
    return rows.map((r) => ({ ...r, is_active: toBool(r.is_active) }));
  }

  async upsertTestimonial(payload) {
    const id = payload.id || makeId();
    const name = payload.name || "";
    const company = payload.company || "";
    const quote = payload.quote || "";
    const is_active = (payload.is_active ?? true) ? 1 : 0;
    const sort_order = Number(payload.sort_order || 0);

    await this.db.execute(
      `INSERT INTO testimonials (id, name, company, quote, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company),
         quote=VALUES(quote), is_active=VALUES(is_active), sort_order=VALUES(sort_order)`,
      [id, name, company, quote, is_active, sort_order]
    );

    const [rows] = await this.db.execute("SELECT * FROM testimonials WHERE id = ?", [id]);
    return { ...rows[0], is_active: toBool(rows[0].is_active) };
  }

  async deleteTestimonial(id) {
    await this.db.execute("DELETE FROM testimonials WHERE id = ?", [id]);
    return true;
  }

  // ── Dashboard ──

  async getDashboard() {
    const countOf = async (table) => {
      const [rows] = await this.db.execute(`SELECT COUNT(*) as c FROM ${table}`);
      return rows[0].c;
    };

    const [products, categories, enquiries, serviceRequests] = await Promise.all([
      countOf("products"),
      countOf("categories"),
      countOf("enquiries"),
      countOf("service_requests")
    ]);

    const [recentEnq] = await this.db.execute(
      "SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5"
    );
    const [recentSr] = await this.db.execute(
      "SELECT * FROM service_requests ORDER BY created_at DESC LIMIT 5"
    );

    return {
      counts: { products, categories, enquiries, serviceRequests },
      recentEnquiries: recentEnq,
      recentServiceRequests: recentSr,
      statuses: clone(leadStatuses)
    };
  }
}

