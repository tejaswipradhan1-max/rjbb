# Rajkumari — Ultra-Premium Luxury Spice Ecommerce

## Original Problem Statement
Create an ultra-premium futuristic ecommerce website for Indian luxury spice brand "Rajkumari" by RJBB Foods Pvt. Ltd. Must feel more premium than Apple.com, Aesop, Tesla, Nothing, and Bang & Olufsen. Royal heritage meets futuristic luxury, cinematic, glassmorphism, floating spice particles, 3D rotating spice packet, matte black + royal red + luxury gold.

## Audience / Personas
- **Premium Indian households** — buyers seeking single-origin, stone-ground, unblended Indian spices as an heirloom indulgence.
- **Global luxury food consumers** — international gifting / royal kitchens / fine-dining home cooks.
- **Atelier admin** — RJBB Foods operator managing catalog, patrons, and orders.

## Core Requirements (static)
- Cinematic hero with floating 3D-tilted spice packet and floating spice particles.
- 3D-feel product showcase, glassmorphism cards with hover glow in each spice's accent color.
- Luxury storytelling section (farm → stone grinding → royal lineage).
- Why Rajkumari (6 principles), Royal Heritage About section.
- Full ecommerce: JWT auth (login/register), cart drawer with localStorage persistence, Stripe checkout (test mode), admin panel for orders / patrons / products.
- Matte black + royal red + luxury gold. Cormorant Garamond + Outfit typography. Apple-grade smoothness.

## Architecture
- **Frontend**: React 19 + react-router 7 + framer-motion + Tailwind (custom gold/royal/spice palette) + canvas-based SpiceParticles + Sonner toasts.
- **Backend**: FastAPI + Motor (Mongo) + JWT (PyJWT + bcrypt) + emergentintegrations Stripe.
- **DB Collections**: `users`, `products`, `orders`, `payment_transactions`. Products + admin auto-seeded on startup.
- **Auth**: JWT email/password, role field (`user` / `admin`).
- **Payments**: Stripe Checkout via emergentintegrations, INR currency, polling-based status verification on `/checkout/success`.

## Implemented (2026-02 / Iteration 1)
- Cinematic Hero with framer-motion 3D mouse-tilt spice packet + 80-particle canvas spice dust
- Glassmorphism navbar with cart badge + auth state
- Product showcase with 3D-tilt glow cards (turmeric/chili/coriander)
- Storytelling bento grid (3 chapters: sourcing, stone-grinding, royal lineage)
- WhyRajkumari 6-principle grid
- Royal heritage About section with stats
- Glass cart drawer (add/inc/dec/remove, subtotal, Stripe checkout)
- Login / Register pages with luxury glass-on-particles aesthetic
- Stripe test-mode checkout (INR) — session creation + polling status + DB persistence
- /checkout/success polling page with gold-sealed confirmation
- Admin panel: stat cards + tabs (orders / users / products), gated by admin role
- /shop full collection page
- Backend: 4 seeded products, admin user, all /api routes prefixed, JWT + Stripe wired
- 100% test coverage (18/18 backend tests, all frontend critical flows verified)

## Backlog (P0/P1/P2)
- **P1** — Three.js / WebGL true 3D packet model with HDRI lighting + WebGL spice powder release on hover (currently framer-motion + canvas approximation).
- **P1** — Order history page for logged-in patrons + concierge contact form.
- **P1** — Stone-grinding lottie/video loop in storytelling section.
- **P2** — Admin product create/edit UI (CRUD endpoints exist, UI deferred).
- **P2** — Email order receipts (Resend / SendGrid).
- **P2** — Razorpay UPI alternative for Indian customers.
- **P2** — Gift wrap / hand-numbered tin SKUs.
- **P2** — Lookbook / press section.

## Test Credentials
See `/app/memory/test_credentials.md`.
