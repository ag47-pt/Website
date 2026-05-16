# Project RESTAG (Ag47 Labs Hospitality Platform)

Project RESTAG is a high-end, technical hospitality platform built for the Agência 47 Labs ecosystem. It merges the "Labs Blueprint" aesthetic with the robust features of platforms like `umai.io`.

## 🎨 Design Commitment: "GASTRO-ENGINEERING"
- **Aesthetic**: Technical, blueprint-inspired, dark-first, with immersive hospitality elements.
- **Palette**: Deep Space Black (#000000), Slate Grey (#1A1A1A), and Theme-Reactive Neon Accents (Pink/Lime/Cyan).
- **Geometry**: Sharp corners (0-2px) for technical sections; subtle rounding (12px) for food/dish highlights to maintain appetite appeal.
- **Motion**: Sticky scroll narratives for restaurant stories, staggered metric counters for "Restaurant Performance", and glassmorphism overlays for the reservation flow.

## 🏗️ System Architecture & Monetization

### 1. Business Logic: Modular SaaS
- **Free Tier**: Immersive LP (`/restag/[slug]`).
- **Premium Modules**: 
  - `MENU_DIGITAL`: QR Code + Interactive Menu (21€/mo).
  - `RESERVATIONS`: Booking Engine + Google Widgets (81€/mo).
  - `ADS_ORCHESTRATOR`: Managed traffic (included in 350€ Full Pack).

### 2. Portal B2C (Consumer) - `/restag`
- **Discovery**: WebApp focused on gastro-lovers, providing certified node exploration.
- **Future Mobile**: Native Android/iOS apps for unified hospitality access.

### 3. Dashboard B2B (Merchant) - `/restag/merchant`
- **Module Control**: Feature flags in the UI based on the active subscription plan.
- **Onboarding**: Direct path to activate premium modules.

### 4. Data Strategy
- **Source of Truth**: `data/restaurants.ts` (Typed as `RestaurantLP`).
- **Subscription State**: Each restaurant node contains a `plan` type defining active modules.

---

## 🛠️ Proposed Changes

### [Component] UI Foundation
#### [NEW] `app/restag/layout.tsx`
Base layout with the Labs HUD, Comet scroll bar, and Theme provider.

#### [NEW] `app/restag/components/MapPortal.tsx`
A custom interactive map using SVG or Canvas with the Ag47 Blueprint aesthetic.

### [Pages] B2C Portal
#### [NEW] `app/restag/page.tsx`
Landing page for the portal with "Restaurants Near You" and search.

#### [NEW] `app/restag/[slug]/RestagDetailClient.tsx`
Dynamic restaurant LP using the Labs Landing Page blueprint.

### [Admin] Merchant Dashboard
#### [NEW] `app/restag/admin/page.tsx`
Technical dashboard for restaurant owners.

---

## 🧪 Verification Plan

### Automated Tests
- `npx playwright test app/restag` (Checking navigation and reservation drawer opening).
- `npm run lint` (Ensuring no TS errors in the new components).

### Manual Verification
1.  Check the "Comet" scroll bar on `/restag/[slug]`.
2.  Verify theme reactivity (Neon accents changing color).
3.  Test the reservation flow steps in the Glassmorphism drawer.
