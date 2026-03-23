# Mechnnovation Technologies B2B Website

Greenfield full-stack industrial catalog and quote platform built with React, Vite, Tailwind, Express, and Supabase-ready data/storage integration.

## What is included
- Public B2B catalog with homepage, product catalog, product detail, service request, about, and contact pages
- Admin login, dashboard, product/category management, enquiry pipeline, service request tracking, and content/testimonial editing
- Dual data mode in the API:
  - `memory` mode for local development with no Supabase credentials
  - `supabase` mode when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured
- Signed upload flow with local fallback storage for development and Supabase Storage support for production
- Supabase schema and seed SQL in [`supabase/schema.sql`](/C:/Mechnnovationtech/supabase/schema.sql) and [`supabase/seed.sql`](/C:/Mechnnovationtech/supabase/seed.sql)

## Default local admin
- Email: `admin@mechnnovation.local`
- Password: `ChangeMe123!`

Change these in your `.env` before deploying.

## Local setup
1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start both apps: `npm run dev`
4. Frontend runs on `http://localhost:5173`
5. API runs on `http://localhost:4000`

## Environment notes
- `VITE_API_BASE_URL` should point to the backend `/api` base
- `SUPABASE_STORAGE_BUCKET` defaults to `uploads`
- In memory mode, uploads are stored under `apps/api/uploads`

## Deployment shape
- Frontend: Cloudflare Pages
- Backend: Render or Railway
- Database / storage: Supabase PostgreSQL + Storage

## Stitch reference
Homepage screen was generated in Stitch project `Mechnnovation Technologies B2B Website` and used as the visual direction for the dark industrial design system.
