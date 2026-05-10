---
id: rest-ag47
type: web-app-saas
version: 0.1.0
client: Rest.AG47 — Agência Full Service PT
domain: rest.ag47.pt
market: pt
phase: mvp
stack:
  framework: next.js@15.2
  runtime: node@22
  database: supabase@2 (postgresql@16 + realtime + storage + auth)
  orm: drizzle-orm@0.38 (sobre supabase pg)
  deploy: vercel (edge runtime onde aplicável)
  payments: stripe@17 + mbway (via stripe PT) + apple-pay + google-pay
integrations:
  - supabase-auth
  - stripe-billing
  - resend-email
  - whatsapp-cloud-api
  - openai-gpt4o
  - posthog-analytics
  - sentry
compliance:
  rgpd: true
  cnpd: true
  wcag: "AA"
  pci: true   # pagamentos com dados de cartão via Stripe
i18n:
  default: pt-PT
  supported: [pt-PT, en-GB, es-ES]
  timezone: Europe/Lisbon
ui:
  theme: light-dark   # CSS prefers-color-scheme + toggle manual
  design-system: shadcn/ui + tailwindcss@4
aiTargets: [cursor, windsurf, github-copilot-workspace]
estimatedWaves: 5
reference: https://restaurants.umai.io
verifiedAt: null   # 📝 TODO: validar todos os endpoints Supabase/Stripe/Meta antes da Wave 2
---

# Rest.AG — Sistema de Reservas para Restaurantes (rest.ag47.pt)

> **Referência de produto**: https://restaurants.umai.io  
> **Missão**: SaaS B2B para restaurantes em Portugal que substitui o livro de reservas manual por um sistema de gestão completo — reservas online, gestão de mesas em tempo real, CRM de clientes, marketing automatizado e analytics. Monetização por subscrição mensal com módulos adicionais pagos.

---

## 🎯 Visão Geral

Rest.AG é uma plataforma SaaS para o sector da restauração em Portugal que oferece:

- **Widget de reservas embebível** no site/Google/Instagram do restaurante
- **Dashboard operacional** para gestão de mesas, reservas e lista de espera em tempo real
- **CRM de clientes** com perfis detalhados, histórico de visitas e preferências
- **Marketing automatizado** com campanhas por email/WhatsApp/SMS
- **Módulos opcionais** cobrados no plano: pagamentos de depósito, IA de atendimento, loyalty, analytics avançado
- **Pagamentos PT-first**: MBway, Apple Pay, Google Pay, cartão

---

## 📋 Contexto de Negócio

- **Sector**: Restauração — restaurantes, bistrots, fine dining, grupos multi-outlet
- **Mercado**: Portugal — fuso `Europe/Lisbon`, locale `pt-PT`, moeda EUR, NIF obrigatório para faturação, RGPD/CNPD
- **Modelo de negócio**: SaaS B2B — subscrição mensal por restaurante + add-ons de módulos
- **Planos base (referência)**:

| Plano | Target | Preço/mês | Módulos incluídos |
|-------|--------|-----------|------------------|
| **Starter** | Restaurante único, < 50 mesas | 49€ | Reservas + widget + email básico |
| **Pro** | Restaurante único, qualquer dimensão | 99€ | Starter + CRM + WhatsApp + lista espera |
| **Business** | Grupos multi-outlet | 199€ | Pro + analytics avançado + loyalty + API |
| **Enterprise** | Cadeias / Hotéis | Sob consulta | Business + suporte dedicado + white-label |

- **Módulos add-on** (cobranças extras na subscrição):

| Módulo | Preço/mês | Descrição |
|--------|-----------|-----------|
| `mod_deposits` | +19€ | Depósitos e cancelamento fees via Stripe/MBway |
| `mod_ai_concierge` | +29€ | Resposta automática por WhatsApp com GPT-4o |
| `mod_loyalty` | +19€ | Programa de pontos e recompensas |
| `mod_marketing_pro` | +29€ | Campanhas segmentadas email + WhatsApp |
| `mod_white_label` | +49€ | Widget e emails com branding do cliente |
| `mod_pos_integration` | +39€ | Webhook para POS (EPOS Now, Lightspeed) |

---

## 🏗️ Arquitectura

### Diagrama de alto nível

```
[Hóspede]
    ↓ Booking Widget (iframe / Web Component)
[Next.js App — Vercel Edge]
    ↓
[API Routes / Server Actions]
    ├── Supabase Auth (sessões restaurante + hóspedes)
    ├── Supabase DB (PostgreSQL — dados core)
    ├── Supabase Realtime (updates de mesa em tempo real)
    ├── Supabase Storage (logos, imagens de sala)
    ├── Stripe Billing (subscrições + módulos + depósitos)
    ├── Resend (emails transaccionais + campanhas)
    ├── WhatsApp Cloud API (confirmações + IA concierge)
    └── OpenAI GPT-4o (IA concierge — mod_ai_concierge)

[Dashboard Restaurante] → mesma app Next.js, rota /(dashboard)/
[Landing / Marketing] → rota /(marketing)/
[Admin Agência] → rota /(admin)/ — gestão de todas as contas
```

### Estrutura de multi-tenancy

```
Cada restaurante = 1 tenant
Isolamento por RLS (Row Level Security) no Supabase
tenant_id em todas as tabelas → policy: tenant_id = auth.jwt() ->> 'restaurant_id'
```

### Decisões de design

| Decisão | Escolha | Alternativa rejeitada | Motivo |
|---------|---------|----------------------|--------|
| Auth | Supabase Auth | NextAuth | Já incluído no Supabase, RLS nativo, sem overhead |
| ORM | Drizzle + Supabase pg | Prisma | Bundle menor, type-safety preciso, sem runtime, RLS compatível |
| Pagamentos PT | Stripe + MB WAY plugin | Ifthenpay directo | Stripe é o único PSP com MB WAY certificado e Apple/Google Pay unificados |
| Realtime | Supabase Realtime | Pusher / Ably | Incluído no Supabase, sem custo adicional, WebSocket nativo |
| Email | Resend | SendGrid | Melhor DX, React Email templates, preço justo |
| Analytics | PostHog | Mixpanel | Self-hostable, RGPD-friendly, event tracking + session replay |
| i18n | next-intl | i18next | Integração nativa Next.js 15 App Router, Server Components |
| Componentes | shadcn/ui + Radix | MUI / Chakra | Sem dependência de runtime, copy-paste, Tailwind v4 |
| Tema | next-themes | CSS vars manual | Integração shadcn, `prefers-color-scheme` + toggle |

---

## 📦 Stack e Dependências

### `package.json` — dependências de produção

```json
{
  "dependencies": {
    "next": "15.2.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",

    "@supabase/supabase-js": "2.49.0",
    "@supabase/ssr": "0.6.0",

    "drizzle-orm": "0.38.0",
    "drizzle-kit": "0.28.0",
    "postgres": "3.4.4",

    "stripe": "17.0.0",
    "@stripe/stripe-js": "5.0.0",
    "@stripe/react-stripe-js": "3.0.0",

    "resend": "4.0.0",
    "@react-email/components": "0.0.30",

    "openai": "4.77.0",

    "next-intl": "4.0.0",
    "next-themes": "0.4.0",

    "zod": "3.24.0",
    "@t3-oss/env-nextjs": "0.11.0",

    "date-fns": "4.0.0",
    "date-fns-tz": "3.2.0",

    "posthog-js": "1.205.0",
    "posthog-node": "4.5.0",

    "@sentry/nextjs": "8.0.0",

    "lucide-react": "0.477.0",
    "tailwindcss": "4.0.0",
    "class-variance-authority": "0.7.0",
    "clsx": "2.1.0",
    "tailwind-merge": "2.6.0"
  }
}
```

### Variáveis de Ambiente — `.env.example` completo

```bash
# ─── App ─────────────────────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_SECRET=                          # openssl rand -hex 32

# ─── Supabase ────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=            # em: supabase.com → projecto → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # chave anon/public — segura para cliente
SUPABASE_SERVICE_ROLE_KEY=           # NUNCA expor no cliente — apenas server-side
SUPABASE_JWT_SECRET=                 # em: Settings → API → JWT Secret

# ─── Stripe ──────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # pk_test_... / pk_live_...
STRIPE_SECRET_KEY=                   # sk_test_... / sk_live_...
STRIPE_WEBHOOK_SECRET=               # whsec_... — gerado ao criar webhook em: stripe.com/webhooks
# Product IDs dos planos (criar manualmente no Stripe Dashboard primeiro)
STRIPE_PRICE_STARTER=                # price_...
STRIPE_PRICE_PRO=                    # price_...
STRIPE_PRICE_BUSINESS=               # price_...
# Add-ons
STRIPE_PRICE_MOD_DEPOSITS=           # price_...
STRIPE_PRICE_MOD_AI_CONCIERGE=       # price_...
STRIPE_PRICE_MOD_LOYALTY=            # price_...
STRIPE_PRICE_MOD_MARKETING_PRO=      # price_...
STRIPE_PRICE_MOD_WHITE_LABEL=        # price_...
STRIPE_PRICE_MOD_POS_INTEGRATION=    # price_...

# ─── Resend ──────────────────────────────────────────────────────────
RESEND_API_KEY=                      # em: resend.com/api-keys
RESEND_FROM_EMAIL=noreply@rest.ag47.pt
RESEND_FROM_NAME=Rest.AG

# ─── Meta / WhatsApp Cloud API ───────────────────────────────────────
META_APP_ID=
META_APP_SECRET=
META_SYSTEM_USER_TOKEN=
META_WEBHOOK_VERIFY_TOKEN=           # string aleatória, min 20 chars
# Nota: cada restaurante tem o seu próprio META_PHONE_NUMBER_ID — guardado na BD

# ─── OpenAI ──────────────────────────────────────────────────────────
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini             # gpt-4o em produção

# ─── PostHog ─────────────────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=             # em: app.posthog.com → projecto → API Keys
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com   # servidor EU para RGPD

# ─── Sentry ──────────────────────────────────────────────────────────
SENTRY_DSN=
SENTRY_AUTH_TOKEN=                   # para source maps em CI

# ─── i18n ────────────────────────────────────────────────────────────
NEXT_PUBLIC_DEFAULT_LOCALE=pt-PT
```

---

## 🗂️ Estrutura de Ficheiros

```
rest-ag47/
├── src/
│   ├── app/
│   │   ├── [locale]/                      # next-intl routing
│   │   │   ├── (marketing)/               # landing, pricing, features
│   │   │   │   ├── page.tsx
│   │   │   │   └── pricing/page.tsx
│   │   │   ├── (auth)/                    # login, registo, recuperar senha
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (dashboard)/               # área autenticada restaurante
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── reservas/page.tsx      # timeline + lista
│   │   │   │   ├── mesas/page.tsx         # mapa drag-and-drop
│   │   │   │   ├── clientes/page.tsx      # CRM
│   │   │   │   ├── campanhas/page.tsx     # marketing automation
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── definicoes/
│   │   │   │       ├── restaurante/page.tsx
│   │   │   │       ├── plano/page.tsx     # upgrade / módulos
│   │   │   │       └── integrações/page.tsx
│   │   │   └── (admin)/                   # área agência — gestão global
│   │   │       └── ...
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── whatsapp/route.ts
│   │   │   ├── reservas/route.ts
│   │   │   ├── disponibilidade/route.ts
│   │   │   └── health/route.ts
│   │   └── widget/
│   │       └── [restaurantSlug]/          # widget público embebível
│   │           └── page.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts                  # schema Drizzle completo
│   │   │   ├── index.ts                   # cliente Drizzle
│   │   │   └── migrations/
│   │   ├── supabase/
│   │   │   ├── client.ts                  # cliente browser
│   │   │   └── server.ts                  # cliente server (cookies)
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   ├── plans.ts                   # mapeamento planos ↔ price IDs
│   │   │   └── webhooks.ts
│   │   ├── whatsapp/
│   │   │   ├── hmac.ts
│   │   │   ├── sender.ts
│   │   │   └── ai-concierge.ts
│   │   ├── email/
│   │   │   ├── templates/                 # React Email templates
│   │   │   └── sender.ts
│   │   ├── reservas/
│   │   │   ├── availability.ts            # motor de disponibilidade
│   │   │   ├── slot-engine.ts             # cálculo de slots livres
│   │   │   └── rules.ts                   # regras de negócio
│   │   ├── modules/
│   │   │   └── registry.ts                # registo e verificação de módulos activos
│   │   └── env.ts                         # validação @t3-oss/env-nextjs
│   ├── components/
│   │   ├── ui/                            # shadcn/ui
│   │   ├── reservas/
│   │   │   ├── TimelineView.tsx           # vista timeline (estilo UMAI)
│   │   │   ├── FloorPlan.tsx              # mapa de mesas drag-and-drop
│   │   │   ├── BookingForm.tsx
│   │   │   └── WaitlistCard.tsx
│   │   └── widget/
│   │       └── BookingWidget.tsx          # widget embebível público
│   ├── i18n/
│   │   ├── routing.ts
│   │   └── messages/
│   │       ├── pt-PT.json
│   │       ├── en-GB.json
│   │       └── es-ES.json
│   └── middleware.ts                      # next-intl + Supabase auth
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── emails/                                # React Email preview
├── .env.example
├── next.config.ts
└── tailwind.config.ts
```

---

## 🌊 Wave 0 — Fundações e Infra

### Objectivo
Repositório com todas as dependências instaladas, Supabase configurado com RLS, deploy Vercel funcional e variáveis de ambiente validadas.

### Prompt de execução Wave 0

```
Actua como senior engineer Next.js 15 + Supabase. Configura o projecto "rest-ag47" exactamente assim:

1. Cria projecto Next.js 15 com App Router, TypeScript strict, Tailwind v4
   npx create-next-app@latest rest-ag47 --typescript --tailwind --app --src-dir --no-turbopack

2. Instala todas as dependências do package.json acima (copia exactamente)

3. Configura next-intl:
   - src/i18n/routing.ts com locales ['pt-PT', 'en-GB', 'es-ES'] e defaultLocale 'pt-PT'
   - src/middleware.ts combinando next-intl + Supabase createServerClient
   - Estrutura de pastas src/app/[locale]/

4. Configura shadcn/ui:
   npx shadcn@latest init
   Adiciona componentes: button, input, label, dialog, table, badge, card, select, 
   calendar, dropdown-menu, separator, sheet, tabs, toast, tooltip

5. Configura next-themes com ThemeProvider em src/app/[locale]/layout.tsx

6. Valida variáveis de ambiente em src/lib/env.ts com @t3-oss/env-nextjs
   (todas as vars do .env.example, server e client separados)

7. Cria src/app/api/health/route.ts → retorna {status:"ok", ts: ISO string}

8. Configura Sentry: npx @sentry/wizard@latest -i nextjs

Não adiciones lógica de negócio. Confirma cada ficheiro criado.
```

### ✅ Checks Wave 0

- [ ] `npm run dev` inicia sem erros em http://localhost:3000/pt-PT
- [ ] `npm run build` completa sem erros TypeScript
- [ ] `npm run lint` — zero warnings
- [ ] Redireccionamento `/` → `/pt-PT` funcional (middleware)
- [ ] Toggle de tema light/dark funcional
- [ ] `GET /api/health` retorna 200 com JSON `{status:"ok"}`
- [ ] Deploy Vercel Preview funcional (branch `main`)
- [ ] Variáveis de ambiente validadas no startup (env.ts lança erro se faltar algo)

---

## 🌊 Wave 1 — Schema de Dados + Auth Multi-tenant

### Objectivo
Base de dados completa com RLS, autenticação de restaurantes e utilizadores, e isolamento perfeito entre tenants.

### Schema Drizzle Completo

```typescript
// src/lib/db/schema.ts
import {
  pgTable, text, timestamp, uuid, boolean, integer,
  jsonb, pgEnum, date, time, index, uniqueIndex
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────
export const planEnum = pgEnum("plan", ["starter", "pro", "business", "enterprise"]);
export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending", "confirmed", "seated", "completed", "cancelled", "no_show"
]);
export const tableStatusEnum = pgEnum("table_status", [
  "available", "occupied", "reserved", "blocked"
]);
export const moduleIdEnum = pgEnum("module_id", [
  "mod_deposits", "mod_ai_concierge", "mod_loyalty",
  "mod_marketing_pro", "mod_white_label", "mod_pos_integration"
]);

// ─── Restaurantes (tenants) ───────────────────────────────────────────
export const restaurants = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),          // rest.ag47.pt/widget/[slug]
  name: text("name").notNull(),
  nif: text("nif").notNull(),                     // NIF PT obrigatório para faturação
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  timezone: text("timezone").notNull().default("Europe/Lisbon"),
  defaultLocale: text("default_locale").notNull().default("pt-PT"),
  // Configurações de reserva
  slotDurationMinutes: integer("slot_duration_minutes").notNull().default(90),
  maxPartySize: integer("max_party_size").notNull().default(20),
  minAdvanceHours: integer("min_advance_hours").notNull().default(1),
  maxAdvanceDays: integer("max_advance_days").notNull().default(60),
  depositRequired: boolean("deposit_required").notNull().default(false),
  depositAmountCents: integer("deposit_amount_cents").default(0),
  // Stripe
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: planEnum("plan").notNull().default("starter"),
  planStatus: text("plan_status").notNull().default("active"), // active | past_due | cancelled
  // Meta / WhatsApp
  metaPhoneNumberId: text("meta_phone_number_id"),
  whatsappEnabled: boolean("whatsapp_enabled").notNull().default(false),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_restaurants_slug").on(t.slug),
  index("idx_restaurants_stripe_customer").on(t.stripeCustomerId),
]);

// ─── Módulos activos por restaurante ─────────────────────────────────
export const restaurantModules = pgTable("restaurant_modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  moduleId: moduleIdEnum("module_id").notNull(),
  stripeItemId: text("stripe_item_id"),            // subscription item ID no Stripe
  activeAt: timestamp("active_at").defaultNow().notNull(),
  cancelledAt: timestamp("cancelled_at"),
}, (t) => [
  uniqueIndex("idx_restaurant_module_unique").on(t.restaurantId, t.moduleId),
]);

// ─── Salas e zonas ────────────────────────────────────────────────────
export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),                    // "Interior", "Esplanada", "Bar"
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Mesas ────────────────────────────────────────────────────────────
export const tables = pgTable("tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id).notNull(),
  tableNumber: text("table_number").notNull(),
  minCovers: integer("min_covers").notNull().default(1),
  maxCovers: integer("max_covers").notNull().default(4),
  positionX: integer("position_x").notNull().default(0),
  positionY: integer("position_y").notNull().default(0),
  shape: text("shape").notNull().default("rectangle"),  // rectangle | round | square
  status: tableStatusEnum("status").notNull().default("available"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("idx_tables_restaurant").on(t.restaurantId),
]);

// ─── Horários ────────────────────────────────────────────────────────
export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Dom, 1=Seg, ... 6=Sáb (ISO: 1=Seg)
  serviceLabel: text("service_label").notNull().default("Almoço"), // "Almoço" | "Jantar"
  openTime: time("open_time").notNull(),
  closeTime: time("close_time").notNull(),
  maxCoversPerSlot: integer("max_covers_per_slot"),
  isActive: boolean("is_active").notNull().default(true),
});

// ─── Bloqueios de agenda ──────────────────────────────────────────────
export const scheduleBlocks = pgTable("schedule_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  blockedDate: date("blocked_date").notNull(),
  blockedFrom: time("blocked_from"),              // null = dia inteiro
  blockedTo: time("blocked_to"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Hóspedes (CRM) ──────────────────────────────────────────────────
export const guests = pgTable("guests", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),                            // normalizado: +351XXXXXXXXX
  tags: text("tags").array().default([]),          // ["vip","alergias","regular"]
  notes: text("notes"),                            // notas internas — nunca exibir ao hóspede
  visitCount: integer("visit_count").notNull().default(0),
  noShowCount: integer("no_show_count").notNull().default(0),
  lastVisitAt: timestamp("last_visit_at"),
  birthdate: date("birthdate"),
  marketingConsent: boolean("marketing_consent").notNull().default(false),
  gdprConsentAt: timestamp("gdpr_consent_at"),    // RGPD: registo de consentimento
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_guests_restaurant").on(t.restaurantId),
  index("idx_guests_phone").on(t.phone),
  index("idx_guests_email").on(t.email),
]);

// ─── Reservas ────────────────────────────────────────────────────────
export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  guestId: uuid("guest_id").references(() => guests.id),
  tableId: uuid("table_id").references(() => tables.id),
  // Dados da reserva
  guestName: text("guest_name").notNull(),         // desnormalizado — snapshot no momento da reserva
  guestPhone: text("guest_phone").notNull(),
  guestEmail: text("guest_email"),
  partySize: integer("party_size").notNull(),
  reservationDate: date("reservation_date").notNull(),
  reservationTime: time("reservation_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(90),
  status: reservationStatusEnum("status").notNull().default("pending"),
  source: text("source").notNull().default("widget"), // widget | phone | walk-in | google
  notes: text("notes"),                            // pedido especial do hóspede
  internalNotes: text("internal_notes"),           // nota interna do staff
  // Confirmação
  confirmationToken: text("confirmation_token").unique(),
  confirmedAt: timestamp("confirmed_at"),
  // Depósito (mod_deposits)
  depositRequired: boolean("deposit_required").notNull().default(false),
  depositAmountCents: integer("deposit_amount_cents").default(0),
  depositPaidAt: timestamp("deposit_paid_at"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_reservations_restaurant_date").on(t.restaurantId, t.reservationDate),
  index("idx_reservations_guest").on(t.guestId),
  index("idx_reservations_status").on(t.status),
  index("idx_reservations_confirmation_token").on(t.confirmationToken),
]);

// ─── Lista de espera ──────────────────────────────────────────────────
export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  guestName: text("guest_name").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestEmail: text("guest_email"),
  partySize: integer("party_size").notNull(),
  requestedDate: date("requested_date").notNull(),
  requestedTimeFrom: time("requested_time_from"),
  notifiedAt: timestamp("notified_at"),
  convertedToReservationId: uuid("converted_to_reservation_id").references(() => reservations.id),
  expiresAt: timestamp("expires_at").notNull(),    // TTL — auto-cleanup
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Campanhas de marketing ───────────────────────────────────────────
export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),                    // birthday | lapsed | event | custom
  channel: text("channel").notNull(),              // email | whatsapp | both
  status: text("status").notNull().default("draft"), // draft | scheduled | running | completed
  segmentRules: jsonb("segment_rules"),            // {lastVisitDaysAgo: 90, tags: ["vip"]}
  messageTemplate: text("message_template").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  sentCount: integer("sent_count").notNull().default(0),
  openCount: integer("open_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Feedback / Reviews ──────────────────────────────────────────────
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  reservationId: uuid("reservation_id").references(() => reservations.id),
  guestId: uuid("guest_id").references(() => guests.id),
  rating: integer("rating").notNull(),             // 1-5
  comment: text("comment"),
  isPublic: boolean("is_public").notNull().default(false),
  publishedToGoogle: boolean("published_to_google").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Tipos exportados ─────────────────────────────────────────────────
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type Table = typeof tables.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type Waitlist = typeof waitlist.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type RestaurantModule = typeof restaurantModules.$inferSelect;
```

### RLS Policies Supabase (SQL)

```sql
-- Executar em supabase/migrations/001_rls_policies.sql

-- Todas as tabelas multi-tenant: leitura/escrita apenas pelo restaurant_id do JWT
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_modules ENABLE ROW LEVEL SECURITY;

-- Policy genérica (replicar para cada tabela)
CREATE POLICY "tenant_isolation" ON reservations
  USING (restaurant_id = (auth.jwt() ->> 'restaurant_id')::uuid);

-- Widget público: acesso read-only sem auth (disponibilidade)
CREATE POLICY "public_availability_read" ON schedules
  FOR SELECT USING (true);
```

### ✅ Checks Wave 1

- [ ] `npx drizzle-kit push` aplica schema sem erros
- [ ] RLS activo — query sem auth retorna 0 rows (não erro)
- [ ] Login com Supabase Auth retorna JWT com `restaurant_id` no claim
- [ ] Admin pode ler dados de múltiplos tenants; restaurante A não vê dados de B
- [ ] `npx drizzle-kit studio` abre com todas as tabelas visíveis

---

## 🌊 Wave 2 — Motor de Reservas e Widget Público

### Objectivo
Motor de disponibilidade que calcula slots livres em tempo real, e widget embebível público que qualquer restaurante pode colocar no seu site.

### Motor de Disponibilidade

```typescript
// src/lib/reservas/availability.ts
import { db } from "@/lib/db";
import { reservations, schedules, scheduleBlocks, tables } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { parseISO, addMinutes, format, isWithinInterval } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export interface SlotAvailability {
  time: string;           // "12:30"
  availableCovers: number;
  availableTables: number;
  isAvailable: boolean;
}

export async function getAvailableSlots(params: {
  restaurantId: string;
  date: string;           // "YYYY-MM-DD"
  partySize: number;
  timezone?: string;
}): Promise<SlotAvailability[]> {
  const { restaurantId, date, partySize, timezone = "Europe/Lisbon" } = params;

  // 1. Verificar bloqueios nesse dia
  const blocks = await db.select().from(scheduleBlocks)
    .where(and(
      eq(scheduleBlocks.restaurantId, restaurantId),
      eq(scheduleBlocks.blockedDate, date)
    ));
  if (blocks.some(b => !b.blockedFrom)) return []; // dia inteiro bloqueado

  // 2. Obter horário do dia da semana
  const dayOfWeek = new Date(date).getDay();
  const daySchedules = await db.select().from(schedules)
    .where(and(
      eq(schedules.restaurantId, restaurantId),
      eq(schedules.dayOfWeek, dayOfWeek),
      eq(schedules.isActive, true)
    ));
  if (!daySchedules.length) return [];

  // 3. Obter mesas que comportam o partySize
  const eligibleTables = await db.select().from(tables)
    .where(and(
      eq(tables.restaurantId, restaurantId),
      eq(tables.isActive, true),
      lte(tables.minCovers, partySize),
      gte(tables.maxCovers, partySize)
    ));

  // 4. Obter reservas confirmadas/pendentes nesse dia
  const existingReservations = await db.select().from(reservations)
    .where(and(
      eq(reservations.restaurantId, restaurantId),
      eq(reservations.reservationDate, date),
    )).then(rows => rows.filter(r =>
      ["pending", "confirmed", "seated"].includes(r.status)
    ));

  // 5. Calcular slots disponíveis por serviço
  const slots: SlotAvailability[] = [];

  for (const schedule of daySchedules) {
    const [openH, openM] = schedule.openTime.split(":").map(Number);
    const [closeH, closeM] = schedule.closeTime.split(":").map(Number);
    const baseDate = new Date(date);
    let current = new Date(baseDate.setHours(openH, openM, 0, 0));
    const close = new Date(date);
    close.setHours(closeH, closeM, 0, 0);

    while (current < close) {
      const slotTime = format(current, "HH:mm");
      const slotEnd = addMinutes(current, 90); // slot padrão 90min

      // Contar mesas ocupadas neste slot
      const occupiedTableIds = new Set(
        existingReservations
          .filter(r => {
            const rStart = new Date(`${date}T${r.reservationTime}`);
            const rEnd = addMinutes(rStart, r.durationMinutes);
            return rStart < slotEnd && rEnd > current;
          })
          .map(r => r.tableId)
          .filter(Boolean)
      );

      const availableTables = eligibleTables.filter(t => !occupiedTableIds.has(t.id));
      const maxCoversAvailable = availableTables.reduce((sum, t) => sum + t.maxCovers, 0);
      const isAvailable = availableTables.length > 0 && partySize <= maxCoversAvailable;

      slots.push({
        time: slotTime,
        availableCovers: maxCoversAvailable,
        availableTables: availableTables.length,
        isAvailable,
      });

      current = addMinutes(current, 30); // incremento de 30 em 30 min
    }
  }

  return slots;
}
```

### Contratos de API — Reservas e Disponibilidade

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| `GET` | `/api/disponibilidade?restaurantId=&date=&partySize=` | Público | Slots disponíveis para widget |
| `POST` | `/api/reservas` | Público | Criar reserva (hóspede) |
| `GET` | `/api/reservas?date=&status=` | Bearer (restaurante) | Listar reservas do dia |
| `PATCH` | `/api/reservas/:id` | Bearer | Actualizar estado da reserva |
| `DELETE` | `/api/reservas/:id` | Bearer | Cancelar reserva |
| `GET` | `/api/reservas/:id/confirm?token=` | Público | Confirmar via link de email |
| `POST` | `/api/waitlist` | Público | Entrar na lista de espera |

### Widget Embebível

```typescript
// src/app/widget/[restaurantSlug]/page.tsx
// Página pública — sem auth — renderiza BookingWidget
// Embebível via: <iframe src="https://rest.ag47.pt/widget/[slug]" />
// Ou via Web Component: <restag-widget slug="[slug]" />

export default async function WidgetPage({
  params: { restaurantSlug }
}: {
  params: { restaurantSlug: string }
}) {
  const restaurant = await getRestaurantBySlug(restaurantSlug);
  if (!restaurant) notFound();

  return (
    <BookingWidget
      restaurant={restaurant}
      locale={restaurant.defaultLocale}
      theme="auto"  // respeita prefers-color-scheme do hóspede
    />
  );
}
```

### Fluxo de Confirmação com Depósito (mod_deposits)

```
[Hóspede submete reserva]
         ↓
[API cria reserva status="pending", gera confirmationToken]
         ↓
   ┌─── depositRequired? ────────────────────────────────────────┐
   │ NÃO                              SIM (mod_deposits activo)  │
   ↓                                          ↓                   │
[status → "confirmed"]         [Stripe: cria PaymentIntent]        │
[envia email/WA confirmação]   [envia email/WA com link pagamento] │
                                       ↓                           │
                               [Hóspede paga MBway/Apple/Google]  │
                                       ↓                           │
                               [Webhook Stripe: payment_intent.succeeded]
                                       ↓                           │
                               [status → "confirmed"]              │
                               [depositPaidAt = now]               │
                               [envia confirmação final]           │
                                                                   │
   └────────────────────────────────────────────────────────────┘
```

### Regras de Negócio — Wave 2

1. **Slot mínimo de antecedência**: não aceitar reservas com menos de `minAdvanceHours` de antecedência
2. **Slot máximo de antecedência**: não aceitar reservas com mais de `maxAdvanceDays` de avanço
3. **Party size**: apenas mesas com `minCovers ≤ partySize ≤ maxCovers` são elegíveis
4. **Overbooking**: o motor de slots deve ser optimistic — em caso de race condition, a reserva posterior recebe erro 409
5. **Depósito expira**: PaymentIntent expira em 30 minutos — reserva passa a "cancelled" automaticamente via Supabase Edge Function
6. **Token de confirmação**: válido 24h — após esse prazo, reserva passa a "pending" novamente e envia novo email

### ✅ Checks Wave 2

- [ ] `GET /api/disponibilidade` retorna slots correctos para amanhã com 2 pessoas
- [ ] Criar reserva para slot ocupado retorna `409 Conflict`
- [ ] Criar reserva com partySize > maxCovers de todas as mesas retorna `422`
- [ ] Link de confirmação no email confirma a reserva
- [ ] Widget renderiza em iframe sem erros de CORS ou CSP
- [ ] Widget respeita tema dark/light do dispositivo do hóspede
- [ ] Reserva com depósito: PaymentIntent criado no Stripe com metadata `reservationId`

---

## 🌊 Wave 3 — Dashboard Operacional (Timeline + Mapa de Mesas)

### Objectivo
Interface operacional do restaurante: timeline de reservas do dia (estilo UMAI), mapa drag-and-drop de mesas, e gestão de lista de espera em tempo real via Supabase Realtime.

### Prompt de execução Wave 3

```
Cria o dashboard operacional em src/app/[locale]/(dashboard)/reservas/page.tsx.

COMPONENTE TimelineView:
- Vista horizontal por hora (ex: 12:00 → 23:00) com escala temporal
- Cada coluna = mesa; cada bloco = reserva (nome hóspede + n.º pessoas)
- Blocos coloridos por status: pending=amber, confirmed=blue, seated=green, no_show=red
- Drag-and-drop de reservas entre mesas e horários (@dnd-kit/core)
- Actualização em tempo real via Supabase Realtime (canal: reservations:restaurant_id)
- Botão de acção rápida: confirmar / sentar / completar / no-show

COMPONENTE FloorPlan:
- Mapa visual das mesas com posicionamento livre (drag-and-drop de configuração)
- Cores por estado: available=verde, occupied=vermelho, reserved=azul, blocked=cinzento
- Click numa mesa → painel lateral com detalhes da reserva activa
- Toggle sala/zona (Interior, Esplanada, Bar)

COMPONENTE WaitlistPanel:
- Lista de espera do dia com botão "Notificar" → envia WhatsApp/email ao hóspede
- Converter item da lista de espera para reserva com 1 clique

Requisitos técnicos:
- Server Component para dados iniciais; Client Component para interactividade
- Supabase Realtime para updates sem refresh
- Todas as acções via Server Actions (não fetch manual)
- Optimistic updates na UI antes da confirmação do servidor
- Acessibilidade: WCAG AA — teclas de atalho (K=próxima reserva, C=confirmar, S=sentar)
```

### Contrato de Server Actions

```typescript
// src/lib/reservas/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireRestaurantAuth } from "@/lib/supabase/auth-helpers";

const updateStatusSchema = z.object({
  reservationId: z.string().uuid(),
  status: z.enum(["confirmed", "seated", "completed", "cancelled", "no_show"]),
  internalNotes: z.string().optional(),
});

export async function updateReservationStatus(
  formData: FormData | z.infer<typeof updateStatusSchema>
) {
  const session = await requireRestaurantAuth();
  const data = updateStatusSchema.parse(formData);

  const [updated] = await db.update(reservations)
    .set({ status: data.status, updatedAt: new Date() })
    .where(eq(reservations.id, data.reservationId))
    .returning();

  // Verificar tenant isolation
  if (updated.restaurantId !== session.restaurantId) {
    throw new Error("Forbidden");
  }

  revalidatePath("/[locale]/(dashboard)/reservas", "page");
  return updated;
}

export async function assignTable(reservationId: string, tableId: string) {
  const session = await requireRestaurantAuth();
  // ... implementar
}

export async function notifyWaitlistGuest(waitlistId: string) {
  const session = await requireRestaurantAuth();
  // Envia email + WhatsApp (se mod_ai_concierge activo)
  // ... implementar
}
```

### ✅ Checks Wave 3

- [ ] Timeline exibe reservas do dia correctamente por ordem cronológica
- [ ] Drag-and-drop de reserva entre mesas actualiza a BD e a UI
- [ ] Supabase Realtime: nova reserva criada no widget aparece no dashboard sem refresh
- [ ] Botão "Sentar" muda status para `seated` com optimistic update
- [ ] FloorPlan exibe cores correctas por status em tempo real
- [ ] Notificação de lista de espera: email enviado via Resend em < 5s
- [ ] Acessibilidade: navegação por teclado funcional (K, C, S)

---

## 🌊 Wave 4 — Stripe Billing + Módulos Dinâmicos

### Objectivo
Sistema de subscrições com Stripe, add-ons de módulos cobrados adicionalmente, e lógica de verificação de módulos antes de activar features premium.

### Planos e Módulos no Stripe

```typescript
// src/lib/stripe/plans.ts
import { env } from "@/lib/env";

export const PLANS = {
  starter: {
    priceId: env.STRIPE_PRICE_STARTER,
    modules: [] as string[], // sem módulos incluídos
  },
  pro: {
    priceId: env.STRIPE_PRICE_PRO,
    modules: [] as string[],
  },
  business: {
    priceId: env.STRIPE_PRICE_BUSINESS,
    modules: ["mod_marketing_pro"] as string[], // marketing_pro incluído
  },
  enterprise: {
    priceId: null, // sob consulta — activado manualmente
    modules: ["mod_marketing_pro", "mod_loyalty", "mod_white_label"] as string[],
  },
} as const;

export const MODULE_PRICES: Record<string, string> = {
  mod_deposits: env.STRIPE_PRICE_MOD_DEPOSITS,
  mod_ai_concierge: env.STRIPE_PRICE_MOD_AI_CONCIERGE,
  mod_loyalty: env.STRIPE_PRICE_MOD_LOYALTY,
  mod_marketing_pro: env.STRIPE_PRICE_MOD_MARKETING_PRO,
  mod_white_label: env.STRIPE_PRICE_MOD_WHITE_LABEL,
  mod_pos_integration: env.STRIPE_PRICE_MOD_POS_INTEGRATION,
};
```

### Registo e Verificação de Módulos

```typescript
// src/lib/modules/registry.ts
import { db } from "@/lib/db";
import { restaurantModules, restaurants } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { PLANS } from "@/lib/stripe/plans";

export async function hasModule(restaurantId: string, moduleId: string): Promise<boolean> {
  // 1. Verificar se o plano inclui o módulo gratuitamente
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, restaurantId),
    columns: { plan: true }
  });
  if (!restaurant) return false;

  const planModules = PLANS[restaurant.plan as keyof typeof PLANS]?.modules ?? [];
  if (planModules.includes(moduleId)) return true;

  // 2. Verificar add-on activo
  const activeModule = await db.query.restaurantModules.findFirst({
    where: and(
      eq(restaurantModules.restaurantId, restaurantId),
      eq(restaurantModules.moduleId, moduleId as any),
      isNull(restaurantModules.cancelledAt)
    )
  });

  return !!activeModule;
}

// Uso nos Server Components / Actions:
// if (!await hasModule(restaurantId, "mod_ai_concierge")) {
//   throw new Error("MODULE_NOT_ACTIVE: mod_ai_concierge");
// }
```

### Webhook Stripe

```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { restaurants, restaurantModules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Webhook signature invalid", { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const restaurantId = sub.metadata.restaurantId;
      // Actualizar plano e status na BD
      // Sincronizar módulos activos com subscription items
      break;
    }
    case "customer.subscription.deleted": {
      // Marcar planStatus = "cancelled", desactivar módulos
      break;
    }
    case "invoice.payment_failed": {
      // planStatus = "past_due", notificar por email
      break;
    }
    case "payment_intent.succeeded": {
      // Depósito de reserva pago — activar reserva
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata.type === "reservation_deposit") {
        // Confirmar reserva pi.metadata.reservationId
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
```

### ✅ Checks Wave 4

- [ ] Subscrição Starter criada no Stripe após registo → restaurante activo na BD
- [ ] Upgrade Starter → Pro: plano actualizado na BD via webhook
- [ ] Activar módulo `mod_deposits`: item adicionado à subscrição Stripe, BD actualizada
- [ ] `hasModule("x", "mod_deposits")` retorna `false` sem add-on activo
- [ ] `hasModule("x", "mod_deposits")` retorna `true` após activação
- [ ] Pagamento falhado: email de alerta enviado, `planStatus = "past_due"`
- [ ] Depósito de reserva pago via MBway → reserva confirmada automaticamente

---

## 🌊 Wave 5 — Marketing, CRM, IA Concierge e Produção

### Objectivo
Automação de marketing, IA de atendimento via WhatsApp, notificações completas e deploy de produção.

### IA Concierge (mod_ai_concierge)

```typescript
// src/lib/whatsapp/ai-concierge.ts
import { openai } from "@/lib/openai";
import { getAvailableSlots } from "@/lib/reservas/availability";
import { hasModule } from "@/lib/modules/registry";

const SYSTEM_PROMPT = (restaurantName: string, locale: string) => `
És o assistente virtual do restaurante ${restaurantName}.
Língua de resposta: ${locale === "pt-PT" ? "Português de Portugal" : locale}.
NUNCA inventes informação sobre o restaurante. 
Podes: consultar disponibilidade, aceitar pedidos de reserva, responder a FAQs do restaurante.
Não podes: processar pagamentos, cancelar reservas (redirige para o site).
Sê sempre simpático, conciso e profissional. Máximo 160 caracteres por mensagem (WhatsApp).
`.trim();

export async function handleConciergeMessage(params: {
  restaurantId: string;
  restaurantName: string;
  from: string;           // número do hóspede
  message: string;
  locale?: string;
}): Promise<string> {
  const { restaurantId, restaurantName, message, locale = "pt-PT" } = params;

  // Verificar módulo activo
  const canUseAI = await hasModule(restaurantId, "mod_ai_concierge");
  if (!canUseAI) return ""; // não responde — sem módulo activo

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT(restaurantName, locale) },
      { role: "user", content: message }
    ],
    max_tokens: 200,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content ?? "";
}
```

### Notificações Automáticas (Email + WhatsApp)

| Evento | Canal | Template | Timing |
|--------|-------|----------|--------|
| Reserva criada | Email + WA | `reservation-created` | Imediato |
| Reserva confirmada | Email + WA | `reservation-confirmed` | Imediato |
| Lembrete 24h antes | Email + WA | `reservation-reminder-24h` | -24h (cron) |
| Lembrete 2h antes | WA | `reservation-reminder-2h` | -2h (cron) |
| Pedido de feedback | Email + WA | `feedback-request` | +2h após `completed` |
| Lista de espera disponível | WA | `waitlist-available` | Imediato |
| Depósito pendente | Email + WA | `deposit-required` | Imediato |
| Pagamento confirmado | Email | `deposit-confirmed` | Imediato (webhook) |
| Subscrição expirada | Email | `subscription-past-due` | Imediato (webhook) |

### Checklist de Produção

```
1. Domínio rest.ag47.pt apontado para Vercel (CNAME + SSL automático)
2. Supabase: projecto em região EU-West (Frankfurt) para RGPD
3. Stripe: modo Live activado, webhook URL de produção registada
4. Meta: app em modo Live, webhook de produção verificado
5. Resend: domínio rest.ag47.pt verificado (SPF + DKIM + DMARC)
6. PostHog: projecto EU configurado (RGPD — sem cookies de tracking sem consentimento)
7. Sentry: alertas de erro configurados (Slack/email)
8. Cron jobs Vercel configurados:
   - /api/cron/reminders-24h → todos os dias às 10:00
   - /api/cron/reminders-2h  → de hora em hora
   - /api/cron/waitlist-cleanup → diariamente à meia-noite
9. Banner de cookies + Política de Privacidade em PT (RGPD obrigatório)
10. DPA assinado com Stripe, Supabase, Resend, Meta, OpenAI
```

### ✅ Checks Wave 5

- [ ] WhatsApp: mensagem enviada pelo restaurante → hóspede recebe em < 3s
- [ ] IA Concierge: mensagem de hóspede respondida pela IA em < 5s
- [ ] Email de lembrete 24h: enviado e recebido na caixa de entrada (não spam)
- [ ] Cron de lembrete: corre sem erros em `/api/cron/reminders-24h`
- [ ] Campanha de aniversários: hóspedes com aniversário hoje recebem email
- [ ] RGPD: deleting account elimina todos os dados pessoais (CASCADE na BD)
- [ ] Lighthouse mobile score ≥ 90 em `/widget/[slug]`
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## 🚫 Armadilhas Críticas

### Segurança e Multi-tenant
- **NUNCA** fazer queries sem filtrar por `restaurant_id` — sempre validar via RLS + código
- **NUNCA** expor `SUPABASE_SERVICE_ROLE_KEY` no cliente — apenas em Server Actions/Routes
- **NUNCA** confiar no `restaurant_id` vindo do cliente — sempre extrair do JWT do servidor
- **NUNCA** usar `*` no CORS — widget é público mas API deve ter CORS restrito

### Pagamentos
- **NUNCA** criar PaymentIntent no cliente — sempre no servidor
- **NUNCA** confiar no redirect de sucesso do Stripe para confirmar pagamento — apenas webhook
- **NUNCA** guardar números de cartão ou dados de pagamento na BD — Stripe é o vault
- **SEMPRE** usar `timingSafeEqual` na validação do webhook Stripe

### WhatsApp / Meta
- **NUNCA** usar `req.json()` antes de validar HMAC — usar `req.text()` raw
- **NUNCA** responder challenge GET com JSON — plain text obrigatório
- **SEMPRE** dedupe por `waMessageId` antes de processar — Meta reenvia em falha

### Base de Dados
- **NUNCA** fazer `DELETE` em dados de hóspedes sem confirmar consentimento RGPD
- **SEMPRE** usar soft delete em reservas (status = "cancelled") — nunca apagar registos
- **NUNCA** fazer N+1 queries no dashboard — usar joins ou `with`
- **SEMPRE** adicionar índice em `reservation_date + restaurant_id` — query mais frequente

### Disponibilidade / Race Conditions
- **NUNCA** verificar disponibilidade e depois criar reserva em dois passos separados — usar transacção
- **SEMPRE** gerir conflito com unique constraint + retry na camada de serviço

### RGPD (Portugal / EU)
- **NUNCA** enviar emails de marketing sem `marketingConsent = true` no perfil do hóspede
- **NUNCA** guardar dados de menores (< 18 anos) sem consentimento parental explícito
- **SEMPRE** registar `gdprConsentAt` no momento do primeiro consentimento
- **SEMPRE** implementar "direito ao esquecimento" — `DELETE CASCADE` em guests + anonimização de reservas históricas
- **NUNCA** enviar dados para serviços fora da EU sem DPA (Data Processing Agreement)

### i18n
- **NUNCA** hardcodar strings de UI — tudo em `/i18n/messages/[locale].json`
- **NUNCA** usar `new Date()` sem converter para `Europe/Lisbon` — usar `date-fns-tz`
- **SEMPRE** formatar datas como `DD/MM/YYYY` para locale `pt-PT`
- **SEMPRE** usar `EUR` como moeda, formatar com `Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR'})`

---

## ✅ Checklist de Qualidade Final

### Código
- [ ] `tsc --noEmit` — zero erros TypeScript strict
- [ ] `eslint --max-warnings 0` — zero warnings
- [ ] `npm run build` — build de produção sem erros
- [ ] Testes de integração para motor de disponibilidade (slots correctos)
- [ ] Testes E2E: fluxo completo de reserva com Playwright

### Segurança
- [ ] RLS activo em todas as tabelas multi-tenant
- [ ] Headers de segurança: CSP, HSTS, X-Frame-Options (excepto widget em iframe)
- [ ] Rate limiting nos endpoints públicos (`/api/disponibilidade`, `/api/reservas`)
- [ ] Auditoria OWASP Top 10 antes do go-live

### RGPD
- [ ] Política de Privacidade presente em PT e EN
- [ ] Banner de cookies com opt-in para analytics
- [ ] Formulário "Eliminar conta" implementado (REST DELETE + CASCADE)
- [ ] Logs de auditoria para acções sobre dados pessoais
- [ ] DPA assinado com todos os sub-processadores

### Performance
- [ ] Lighthouse score ≥ 90 mobile para widget público
- [ ] Dashboard: Time to Interactive < 3s em ligação 4G
- [ ] Supabase queries com `EXPLAIN ANALYZE` — sem seq scans em tabelas grandes
- [ ] Bundle size analisado: `ANALYZE=true npm run build`

### Acessibilidade (WCAG AA)
- [ ] Contraste mínimo 4.5:1 em modo light e dark
- [ ] Navegação completa por teclado no widget de reservas
- [ ] `aria-live` para updates de disponibilidade em tempo real
- [ ] Testes com VoiceOver (macOS) e NVDA (Windows)

---

## 🔄 Prompts de Suporte

### Adicionar novo módulo add-on

```
Adiciona o módulo "[NOME_MODULO]" ao sistema Rest.AG47.

1. Adiciona "[nome]" ao enum moduleIdEnum em schema.ts
2. Adiciona price ID STRIPE_PRICE_[NOME] ao .env.example e env.ts
3. Adiciona ao MODULE_PRICES em src/lib/stripe/plans.ts
4. Cria guard: if (!await hasModule(id, "[nome]")) throw "MODULE_NOT_ACTIVE"
5. Adiciona card de toggle na página /definicoes/plano com:
   - Descrição do módulo
   - Preço/mês
   - Botão "Activar" / "Desactivar" via Server Action que chama Stripe subscriptionItems API
6. Regista novo Stripe Price ID no Dashboard e adiciona à .env

Segue exactamente o padrão de mod_deposits como referência.
```

### Debug de disponibilidade incorrecta

```
O motor de disponibilidade está a retornar slots incorrectos.
Contexto: restaurante [ID], data [DATA], partySize [N]
Resultado esperado: [slots esperados]
Resultado actual: [slots recebidos]

Analisa getAvailableSlots() em src/lib/reservas/availability.ts.
Verifica: 1) cálculo de dayOfWeek, 2) overlapping de reservas,
3) elegibilidade de mesas, 4) timezone Europe/Lisbon.
Não alteres a assinatura da função.
```

### Migração de dados (novo campo no schema)

```
Adiciona o campo "[campo]" ([tipo]) à tabela "[tabela]".

1. Adiciona coluna em schema.ts (Drizzle)
2. Cria migração: npx drizzle-kit generate --name="add_[campo]_to_[tabela]"
3. A migração deve ser reversível (sem dados perdidos)
4. Se o campo é NOT NULL, define DEFAULT para não quebrar dados existentes
5. Actualiza todos os tipos inferidos (Type = typeof tabela.$inferSelect)
6. Verifica que o RLS não precisa de ser actualizado
```

---

## 📖 Referências e Fontes

- **Referência de produto**: https://restaurants.umai.io
- **Next.js 15 App Router**: https://nextjs.org/docs/app
- **Supabase Auth + RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **Supabase Realtime**: https://supabase.com/docs/guides/realtime
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
- **Stripe Subscriptions**: https://stripe.com/docs/billing/subscriptions/overview
- **Stripe MBway (Portugal)**: https://stripe.com/docs/payments/multibanco
- **Stripe Apple Pay / Google Pay**: https://stripe.com/docs/stripe-js/elements/payment-request-button
- **next-intl**: https://next-intl-docs.vercel.app
- **Meta WhatsApp Cloud API**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **React Email + Resend**: https://react.email/docs + https://resend.com/docs
- **PostHog (EU)**: https://eu.posthog.com/docs
- **CNPD — Autoridade PT de Protecção de Dados**: https://www.cnpd.pt/
- **RGPD texto integral**: https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32016R0679
- **shadcn/ui**: https://ui.shadcn.com/docs
- **date-fns-tz**: https://date-fns.org/v3/docs/formatInTimeZone

---

> **Nota de verificação**: Todos os endpoints Meta, Stripe e Supabase devem ser
> confirmados nas documentações oficiais na primeira build de cada Wave.
> As versões de pacotes listadas são as mais recentes estáveis em Maio 2025.
> Actualizar antes de iniciar o projecto com `npx npm-check-updates -u`.
