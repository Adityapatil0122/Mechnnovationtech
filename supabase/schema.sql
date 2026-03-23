create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists products (
  id text primary key,
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  specs_json jsonb not null default '{}'::jsonb,
  primary_image_url text not null default '',
  gallery_urls_json jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id text primary key,
  product_id text references products(id) on delete set null,
  name text not null,
  company text not null default '',
  phone text not null,
  email text not null,
  quantity text not null default '',
  message text not null,
  file_url text not null default '',
  status text not null default 'new',
  internal_notes text not null default '',
  follow_up_at text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists service_requests (
  id text primary key,
  name text not null,
  company text not null default '',
  phone text not null,
  email text not null,
  work_type text not null,
  material text not null default '',
  quantity text not null default '',
  deadline text not null default '',
  file_url text not null default '',
  notes text not null default '',
  status text not null default 'new',
  internal_notes text not null default '',
  follow_up_at text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists admin_users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  id text primary key,
  page_key text not null,
  section_key text not null,
  title text not null default '',
  body text not null default '',
  meta_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id text primary key,
  name text not null,
  company text not null default '',
  quote text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_enquiries_status on enquiries(status);
create index if not exists idx_service_requests_status on service_requests(status);
create index if not exists idx_site_content_page_key on site_content(page_key);
