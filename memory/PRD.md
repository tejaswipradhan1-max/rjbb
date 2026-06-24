# Rajkumari — Luxury Indian Spice Ecommerce — PRD

## Original Problem Statement
Ultra-premium futuristic ecommerce website for Indian luxury spice brand "Rajkumari" by RJBB Foods Pvt. Ltd. — must feel more premium than Apple/Aesop/Tesla/Nothing/B&O. Royal heritage meets futuristic luxury. Matte black + royal deep red + luxury gold. Cinematic 3D hero, glassmorphism, floating spice particles, premium typography (Cormorant Garamond + Outfit), buttery scroll animations.

## User Choices (gathered via ask_human)
- Full ecommerce with **Stripe checkout** (test mode via emergentintegrations).
- **JWT** email/password authentication.
- **Admin panel** for products / orders / users.
- Hybrid animation strategy — framer-motion 3D tilt + canvas spice particles (no Three.js heavy load).
- User uploaded actual Rajkumari packet images (Haldi, Mirchi, Dhaniya) and the official brand logo PNG.

## Architecture
- **Backend**: FastAPI + Motor (async MongoDB) + emergentintegrations (Stripe) + PyJWT + bcrypt. All routes prefixed `/api`. CORS open.
- **Database collections**: `users`, `products`, `orders`, `payment_transactions`.
- **Frontend**: React 19 + react-router-dom 7 + framer-motion + sonner toasts + Tailwind. Cormorant Garamond serif headings + Outfit body. Custom canvas particle system for floating spice dust. Glassmorphism + gold gradient buttons.
- **Auth**: JWT 14-day expiry; admin seeded on startup; user role gated `/admin`.
- **Payments**: Server-side computed totals; checkout session redirects to Stripe; polling on `/checkout/success?session_id=...`; webhook on `/api/webhook/stripe`.

## Sections / Pages Implemented (2026-02)
- `/` — Cinematic hero (3D-tilt Rajkumari Mirchi packet, golden halo, floating spice particles, oversized "Rajkumari" backdrop wordmark)
- Product showcase — 3 floating glass cards with mouse-tilt and spice-color glow on hover
- Storytelling — bento-art chapters: "Sourced from soil that remembers", "Stone ground in silence", "Sealed in royal lineage"
- Why Rajkumari — 6 differentiators (100% Pure, Stone Ground, No Preservatives, QC, Authentic, Unpolished)
- About — Royal heritage with stats and hand-numbered batch card
- Footer — full nav columns, gold divider, brand mark
- `/shop` — full collection grid with particles
- `/login`, `/register` — glass-strong cards with logo
- `/checkout/success` — polling animation + success seal
- `/admin` — dark luxury data dashboard (orders, users, products tabs, stat cards)

## Seed Data
- 4 products: Shuddh Haldi (₹449), Shuddh Mirchi (₹499), Shuddh Dhaniya (₹379), Royal Garam Masala (₹699)
- Admin: `admin@rajkumari.in` / `Royal@2026`
- Real Rajkumari product packet images (uploaded by user) used in showcase

## Test Status (iteration_2.json)
- Backend: 100% (18/18 pytest) — register/login/me, admin RBAC, products CRUD, Stripe checkout session + status, orders
- Frontend: 100% on tested flows — hero, products, story/why/about, admin gated, login → admin, register, logo loads
- No defects.

## Prioritized Backlog (Future)
- **P1** Three.js-based true 3D rotating packet (currently framer-motion 3D tilt)
- **P1** Product detail page (`/product/:slug`) with hero-style storytelling
- **P1** Admin: product create/edit form (currently API exists, UI is read-only)
- **P2** Customer order history page (`/account/orders`) — backend already has `/api/orders/mine`
- **P2** Newsletter signup + "concierge" contact form for global wholesale
- **P2** Multi-currency (USD/EUR) for international customers
- **P2** Email receipts on successful payment (Resend integration)
- **P3** Gift packaging selector + handwritten message
- **P3** Spice "discovery" quiz tied to recommendations
- **P3** Lifespan migration off deprecated `@app.on_event` handlers
