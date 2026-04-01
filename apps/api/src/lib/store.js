import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "../config/env.js";
import {
  categories as seedCategories,
  companyProfile,
  leadStatuses,
  products as seedProducts,
  siteContent as seedSiteContent,
  testimonials as seedTestimonials
} from "../data/seed.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
const nowIso = () => new Date().toISOString();
const makeId = () => crypto.randomUUID();
const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const withCategory = (product, categoryMap) => ({
  ...product,
  category: categoryMap.get(product.category_id) || null
});

class MemoryStore {
  constructor() {
    this.categories = clone(seedCategories);
    this.products = clone(seedProducts);
    this.siteContent = clone(seedSiteContent);
    this.testimonials = clone(seedTestimonials);
    this.enquiries = [];
    this.serviceRequests = [];
    this.adminUsers = [
      {
        id: "local-admin",
        email: env.adminEmail,
        password_hash: bcrypt.hashSync(env.adminPassword, 10),
        created_at: nowIso()
      }
    ];
  }

  getCompanyProfile() {
    return clone(companyProfile);
  }

  async authenticateAdmin(email, password) {
    const admin = this.adminUsers.find((item) => item.email === email);
    if (!admin) {
      return null;
    }

    const matches = bcrypt.compareSync(password, admin.password_hash);
    return matches ? { id: admin.id, email: admin.email } : null;
  }

  async listCategories({ includeInactive = false } = {}) {
    const items = this.categories
      .filter((item) => includeInactive || item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);

    return clone(items);
  }

  async upsertCategory(payload) {
    const next = {
      id: payload.id || makeId(),
      name: payload.name,
      slug: payload.slug || makeSlug(payload.name),
      description: payload.description || "",
      sort_order: Number(payload.sort_order || 0),
      is_active: payload.is_active ?? true
    };

    const index = this.categories.findIndex((item) => item.id === next.id);

    if (index >= 0) {
      this.categories[index] = { ...this.categories[index], ...next };
      return clone(this.categories[index]);
    }

    this.categories.push(next);
    return clone(next);
  }

  async deleteCategory(id) {
    this.categories = this.categories.filter((item) => item.id !== id);
    return true;
  }

  async listProducts({
    search = "",
    category = "",
    featured = false,
    includeInactive = false,
    page = 1,
    pageSize = 12
  } = {}) {
    const normalizedSearch = search.toLowerCase().trim();
    const categoryMap = new Map(this.categories.map((item) => [item.id, item]));

    let items = this.products.filter((item) => includeInactive || item.is_active);

    if (featured) {
      items = items.filter((item) => item.is_featured);
    }

    if (category) {
      const categoryRecord = this.categories.find(
        (item) => item.slug === category || item.id === category
      );
      items = categoryRecord
        ? items.filter((item) => item.category_id === categoryRecord.id)
        : [];
    }

    if (normalizedSearch) {
      items = items.filter((item) =>
        [item.name, item.short_description, item.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(start, start + pageSize)
      .map((item) => withCategory(item, categoryMap));

    return { items: clone(paged), total };
  }

  async getProductBySlug(slug) {
    const categoryMap = new Map(this.categories.map((item) => [item.id, item]));
    const product = this.products.find(
      (item) => item.slug === slug && item.is_active
    );

    if (!product) {
      return null;
    }

    const related = this.products
      .filter(
        (item) =>
          item.category_id === product.category_id &&
          item.id !== product.id &&
          item.is_active
      )
      .slice(0, 4)
      .map((item) => withCategory(item, categoryMap));

    return {
      product: withCategory(product, categoryMap),
      related
    };
  }

  async upsertProduct(payload) {
    const next = {
      id: payload.id || makeId(),
      category_id: payload.category_id,
      name: payload.name,
      slug: payload.slug || makeSlug(payload.name),
      short_description: payload.short_description || "",
      description: payload.description || "",
      specs_json: payload.specs_json || {},
      primary_image_url: payload.primary_image_url || "",
      gallery_urls_json: payload.gallery_urls_json || [],
      is_featured: payload.is_featured ?? false,
      is_active: payload.is_active ?? true,
      created_at: payload.created_at || nowIso()
    };

    const index = this.products.findIndex((item) => item.id === next.id);

    if (index >= 0) {
      this.products[index] = { ...this.products[index], ...next };
      return clone(this.products[index]);
    }

    this.products.push(next);
    return clone(next);
  }

  async deleteProduct(id) {
    this.products = this.products.filter((item) => item.id !== id);
    return true;
  }

  async createEnquiry(payload) {
    const record = {
      id: makeId(),
      product_id: payload.product_id || null,
      name: payload.name,
      company: payload.company || "",
      phone: payload.phone,
      email: payload.email,
      quantity: payload.quantity || "",
      message: payload.message || "",
      file_url: payload.file_url || "",
      status: "new",
      internal_notes: "",
      follow_up_at: "",
      created_at: nowIso()
    };

    this.enquiries.unshift(record);
    return clone(record);
  }

  async listEnquiries() {
    return clone(this.enquiries);
  }

  async updateEnquiry(id, payload) {
    const index = this.enquiries.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    this.enquiries[index] = { ...this.enquiries[index], ...payload };
    return clone(this.enquiries[index]);
  }

  async createServiceRequest(payload) {
    const record = {
      id: makeId(),
      name: payload.name,
      company: payload.company || "",
      phone: payload.phone,
      email: payload.email,
      work_type: payload.work_type,
      material: payload.material || "",
      quantity: payload.quantity || "",
      deadline: payload.deadline || "",
      file_url: payload.file_url || "",
      notes: payload.notes || "",
      status: "new",
      internal_notes: "",
      follow_up_at: "",
      created_at: nowIso()
    };

    this.serviceRequests.unshift(record);
    return clone(record);
  }

  async listServiceRequests() {
    return clone(this.serviceRequests);
  }

  async updateServiceRequest(id, payload) {
    const index = this.serviceRequests.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    this.serviceRequests[index] = { ...this.serviceRequests[index], ...payload };
    return clone(this.serviceRequests[index]);
  }

  async getPageContent(pageKey) {
    return {
      company: clone(companyProfile),
      sections: clone(
        this.siteContent.filter((item) => item.page_key === pageKey)
      ),
      testimonials: clone(
        this.testimonials
          .filter((item) => item.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
      )
    };
  }

  async listSiteContent() {
    return clone(this.siteContent);
  }

  async upsertSiteContent(payload) {
    const next = {
      id: payload.id || makeId(),
      page_key: payload.page_key,
      section_key: payload.section_key,
      title: payload.title || "",
      body: payload.body || "",
      meta_json: payload.meta_json || {},
      updated_at: nowIso()
    };

    const index = this.siteContent.findIndex((item) => item.id === next.id);
    if (index >= 0) {
      this.siteContent[index] = { ...this.siteContent[index], ...next };
      return clone(this.siteContent[index]);
    }

    this.siteContent.push(next);
    return clone(next);
  }

  async deleteSiteContent(id) {
    this.siteContent = this.siteContent.filter((item) => item.id !== id);
    return true;
  }

  async listTestimonials() {
    return clone(this.testimonials.sort((a, b) => a.sort_order - b.sort_order));
  }

  async upsertTestimonial(payload) {
    const next = {
      id: payload.id || makeId(),
      name: payload.name || "",
      company: payload.company || "",
      quote: payload.quote || "",
      is_active: payload.is_active ?? true,
      sort_order: Number(payload.sort_order || 0)
    };

    const index = this.testimonials.findIndex((item) => item.id === next.id);
    if (index >= 0) {
      this.testimonials[index] = { ...this.testimonials[index], ...next };
      return clone(this.testimonials[index]);
    }

    this.testimonials.push(next);
    return clone(next);
  }

  async deleteTestimonial(id) {
    this.testimonials = this.testimonials.filter((item) => item.id !== id);
    return true;
  }

  async getDashboard() {
    return {
      counts: {
        products: this.products.length,
        categories: this.categories.length,
        enquiries: this.enquiries.length,
        serviceRequests: this.serviceRequests.length
      },
      recentEnquiries: clone(this.enquiries.slice(0, 5)),
      recentServiceRequests: clone(this.serviceRequests.slice(0, 5)),
      statuses: clone(leadStatuses)
    };
  }
}

class SupabaseStore {
  constructor() {
    this.client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false }
    });
  }

  getCompanyProfile() {
    return clone(companyProfile);
  }

  async authenticateAdmin(email, password) {
    const { data, error } = await this.client
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const matches = await bcrypt.compare(password, data.password_hash);
    return matches ? { id: data.id, email: data.email } : null;
  }

  async listCategories({ includeInactive = false } = {}) {
    let query = this.client
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return data || [];
  }

  async upsertCategory(payload) {
    const record = {
      id: payload.id || makeId(),
      name: payload.name,
      slug: payload.slug || makeSlug(payload.name),
      description: payload.description || "",
      sort_order: Number(payload.sort_order || 0),
      is_active: payload.is_active ?? true
    };

    const { data, error } = await this.client
      .from("categories")
      .upsert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteCategory(id) {
    const { error } = await this.client.from("categories").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return true;
  }

  async listProducts({
    search = "",
    category = "",
    featured = false,
    includeInactive = false,
    page = 1,
    pageSize = 12
  } = {}) {
    const categories = await this.listCategories({ includeInactive: true });
    const categoryMap = new Map(categories.map((item) => [item.id, item]));

    let query = this.client
      .from("products")
      .select("*", { count: "exact" })
      .order("name", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (featured) {
      query = query.eq("is_featured", true);
    }

    if (category) {
      const categoryRecord = categories.find(
        (item) => item.slug === category || item.id === category
      );
      query = categoryRecord
        ? query.eq("category_id", categoryRecord.id)
        : query.eq("category_id", "__none__");
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,short_description.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    query = query.range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;
    if (error) {
      throw error;
    }

    return {
      items: (data || []).map((item) => withCategory(item, categoryMap)),
      total: count || 0
    };
  }

  async getProductBySlug(slug) {
    const categories = await this.listCategories({ includeInactive: true });
    const categoryMap = new Map(categories.map((item) => [item.id, item]));
    const { data, error } = await this.client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const { data: related, error: relatedError } = await this.client
      .from("products")
      .select("*")
      .eq("category_id", data.category_id)
      .eq("is_active", true)
      .neq("id", data.id)
      .limit(4);

    if (relatedError) {
      throw relatedError;
    }

    return {
      product: withCategory(data, categoryMap),
      related: (related || []).map((item) => withCategory(item, categoryMap))
    };
  }

  async upsertProduct(payload) {
    const record = {
      id: payload.id || makeId(),
      category_id: payload.category_id,
      name: payload.name,
      slug: payload.slug || makeSlug(payload.name),
      short_description: payload.short_description || "",
      description: payload.description || "",
      specs_json: payload.specs_json || {},
      primary_image_url: payload.primary_image_url || "",
      gallery_urls_json: payload.gallery_urls_json || [],
      is_featured: payload.is_featured ?? false,
      is_active: payload.is_active ?? true,
      created_at: payload.created_at || nowIso()
    };

    const { data, error } = await this.client
      .from("products")
      .upsert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteProduct(id) {
    const { error } = await this.client.from("products").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return true;
  }

  async createEnquiry(payload) {
    const record = {
      id: makeId(),
      product_id: payload.product_id || null,
      name: payload.name,
      company: payload.company || "",
      phone: payload.phone,
      email: payload.email,
      quantity: payload.quantity || "",
      message: payload.message || "",
      file_url: payload.file_url || "",
      status: "new",
      internal_notes: "",
      follow_up_at: "",
      created_at: nowIso()
    };

    const { data, error } = await this.client
      .from("enquiries")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async listEnquiries() {
    const { data, error } = await this.client
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async updateEnquiry(id, payload) {
    const { data, error } = await this.client
      .from("enquiries")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async createServiceRequest(payload) {
    const record = {
      id: makeId(),
      name: payload.name,
      company: payload.company || "",
      phone: payload.phone,
      email: payload.email,
      work_type: payload.work_type,
      material: payload.material || "",
      quantity: payload.quantity || "",
      deadline: payload.deadline || "",
      file_url: payload.file_url || "",
      notes: payload.notes || "",
      status: "new",
      internal_notes: "",
      follow_up_at: "",
      created_at: nowIso()
    };

    const { data, error } = await this.client
      .from("service_requests")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async listServiceRequests() {
    const { data, error } = await this.client
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async updateServiceRequest(id, payload) {
    const { data, error } = await this.client
      .from("service_requests")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async getPageContent(pageKey) {
    const { data: sections, error: sectionsError } = await this.client
      .from("site_content")
      .select("*")
      .eq("page_key", pageKey);

    if (sectionsError) {
      throw sectionsError;
    }

    const { data: testimonials, error: testimonialError } = await this.client
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (testimonialError) {
      throw testimonialError;
    }

    return {
      company: clone(companyProfile),
      sections: sections || [],
      testimonials: testimonials || []
    };
  }

  async listSiteContent() {
    const { data, error } = await this.client
      .from("site_content")
      .select("*")
      .order("page_key", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async upsertSiteContent(payload) {
    const record = {
      id: payload.id || makeId(),
      page_key: payload.page_key,
      section_key: payload.section_key,
      title: payload.title || "",
      body: payload.body || "",
      meta_json: payload.meta_json || {},
      updated_at: nowIso()
    };

    const { data, error } = await this.client
      .from("site_content")
      .upsert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteSiteContent(id) {
    const { error } = await this.client
      .from("site_content")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  }

  async listTestimonials() {
    const { data, error } = await this.client
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async upsertTestimonial(payload) {
    const record = {
      id: payload.id || makeId(),
      name: payload.name || "",
      company: payload.company || "",
      quote: payload.quote || "",
      is_active: payload.is_active ?? true,
      sort_order: Number(payload.sort_order || 0)
    };

    const { data, error } = await this.client
      .from("testimonials")
      .upsert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteTestimonial(id) {
    const { error } = await this.client
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  }

  async getDashboard() {
    const countExact = async (table) => {
      const { count, error } = await this.client
        .from(table)
        .select("*", { head: true, count: "exact" });

      if (error) {
        throw error;
      }

      return count || 0;
    };

    const [products, categories, enquiries, serviceRequests, recentEnquiries, recentServiceRequests] =
      await Promise.all([
        countExact("products"),
        countExact("categories"),
        countExact("enquiries"),
        countExact("service_requests"),
        this.client
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        this.client
          .from("service_requests")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)
      ]);

    return {
      counts: {
        products,
        categories,
        enquiries,
        serviceRequests
      },
      recentEnquiries: recentEnquiries.data || [],
      recentServiceRequests: recentServiceRequests.data || [],
      statuses: clone(leadStatuses)
    };
  }
}

import { MysqlStore } from "./mysql-store.js";

function createStore() {
  if (env.useMySQL) return { store: new MysqlStore(), mode: "mysql" };
  if (isSupabaseConfigured) return { store: new SupabaseStore(), mode: "supabase" };
  return { store: new MemoryStore(), mode: "memory" };
}

const { store: _store, mode: _mode } = createStore();
export const store = _store;
export const storeMode = _mode;
export { leadStatuses };

