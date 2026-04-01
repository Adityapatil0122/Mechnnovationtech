import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import {
  categories,
  products,
  siteContent,
  testimonials
} from "../src/data/seed.js";

const db = await mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "mechnnovation"
});

console.log("Connected to MySQL. Seeding...");

// Admin user
const hash = bcrypt.hashSync("ChangeMe123!", 10);
await db.execute(
  `INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
  ["local-admin", "admin@mechnnovation.local", hash]
);
console.log("  Admin user seeded");

// Categories
for (const c of categories) {
  await db.execute(
    `INSERT INTO categories (id, name, slug, description, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug),
       description=VALUES(description), sort_order=VALUES(sort_order), is_active=VALUES(is_active)`,
    [c.id, c.name, c.slug, c.description, c.sort_order, c.is_active ? 1 : 0]
  );
}
console.log(`  ${categories.length} categories seeded`);

// Products
for (const p of products) {
  await db.execute(
    `INSERT INTO products (id, category_id, name, slug, short_description, description,
       specs_json, primary_image_url, gallery_urls_json, is_featured, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), name=VALUES(name),
       slug=VALUES(slug), short_description=VALUES(short_description),
       description=VALUES(description), specs_json=VALUES(specs_json),
       primary_image_url=VALUES(primary_image_url), gallery_urls_json=VALUES(gallery_urls_json),
       is_featured=VALUES(is_featured), is_active=VALUES(is_active)`,
    [
      p.id, p.category_id, p.name, p.slug, p.short_description, p.description,
      JSON.stringify(p.specs_json), p.primary_image_url,
      JSON.stringify(p.gallery_urls_json), p.is_featured ? 1 : 0,
      p.is_active ? 1 : 0, p.created_at
    ]
  );
}
console.log(`  ${products.length} products seeded`);

// Site content
for (const s of siteContent) {
  await db.execute(
    `INSERT INTO site_content (id, page_key, section_key, title, body, meta_json, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE page_key=VALUES(page_key), section_key=VALUES(section_key),
       title=VALUES(title), body=VALUES(body), meta_json=VALUES(meta_json), updated_at=VALUES(updated_at)`,
    [s.id, s.page_key, s.section_key, s.title, s.body, JSON.stringify(s.meta_json), s.updated_at]
  );
}
console.log(`  ${siteContent.length} site content sections seeded`);

// Testimonials
for (const t of testimonials) {
  await db.execute(
    `INSERT INTO testimonials (id, name, company, quote, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company),
       quote=VALUES(quote), is_active=VALUES(is_active), sort_order=VALUES(sort_order)`,
    [t.id, t.name, t.company, t.quote, t.is_active ? 1 : 0, t.sort_order]
  );
}
console.log(`  ${testimonials.length} testimonials seeded`);

console.log("Done!");
await db.end();
