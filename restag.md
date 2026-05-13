# Project RESTAG (Ag47 Labs Hospitality Platform)

Project RESTAG is a high-end, technical hospitality platform built for the Agência 47 Labs ecosystem. It merges the "Labs Blueprint" aesthetic with the robust features of platforms like `umai.io`.

## 🎨 Design Commitment: "GASTRO-ENGINEERING"
- **Aesthetic**: Technical, blueprint-inspired, dark-first, with immersive hospitality elements.
- **Palette**: Deep Space Black (#000000), Slate Grey (#1A1A1A), and Theme-Reactive Neon Accents (Pink/Lime/Cyan).
- **Geometry**: Sharp corners (0-2px) for technical sections; subtle rounding (12px) for food/dish highlights to maintain appetite appeal.
- **Motion**: Sticky scroll narratives for restaurant stories, staggered metric counters for "Restaurant Performance", and glassmorphism overlays for the reservation flow.

## 🏗️ System Architecture

### 1. Portal B2C (Consumer) - `/restag`
- **Hero**: Immersive search with technical HUD (Coordenadas do usuário, Status do sistema).
- **Discovery**: Interactive Map (using the Labs Blueprint grid as a base) + Grid of restaurants.
- **Restaurant Landing Pages**: `/restag/[slug]` using the `ag47-designer-labs-landing-pages` skill.
- **Reservation System**: A multi-step glassmorphism drawer (`AnimatePresence`).
- **Gift Cards**: Interactive 3D-feeling cards with glow effects.

### 2. Dashboard B2B (Merchant) - `/restag/admin`
- **Stats**: Real-time performance metrics (Revenue, Guest Visits, Visit Rate).
- **Table Management**: Visual grid representing the restaurant floor with real-time status (Labs style).
- **Marketing**: Automated campaign controls with monospace technical labels.

### 3. Data Strategy
- **Source of Truth**: `data/restaurants.ts` (Typed as `RestaurantLP`).
- **State Management**: `RestagContext` for session handling (Current Reservation, Cart, User Preferences).

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
