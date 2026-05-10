import { REST_LOCALES, type RestLocale } from "@/lib/rest/types";

export const DEFAULT_REST_LOCALE: RestLocale = "pt-PT";

export function isRestLocale(value: string): value is RestLocale {
  return REST_LOCALES.includes(value as RestLocale);
}

export function resolveRestLocale(value: string | undefined): RestLocale {
  if (!value) return DEFAULT_REST_LOCALE;
  return isRestLocale(value) ? value : DEFAULT_REST_LOCALE;
}

type RestDictionary = {
  appName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statsLabel: string;
  pricingTitle: string;
  pricingSubtitle: string;
  plans: Array<{ name: string; price: string; features: string[] }>;
};

const dictionaries: Record<RestLocale, RestDictionary> = {
  "pt-PT": {
    appName: "Rest.AG",
    tagline: "Sistema de reservas para restaurantes",
    heroTitle: "Reservas, sala e CRM num unico cockpit",
    heroSubtitle:
      "Substitui o livro manual por operacao em tempo real, automacao e crescimento previsivel.",
    ctaPrimary: "Abrir Dashboard Demo",
    ctaSecondary: "Ver Widget Publico",
    statsLabel: "MVP em construcao por waves",
    pricingTitle: "Planos de subscricao",
    pricingSubtitle: "Preco mensal por restaurante com modulos add-on.",
    plans: [
      {
        name: "Starter",
        price: "49 EUR/mes",
        features: ["Reservas", "Widget", "Email basico"],
      },
      {
        name: "Pro",
        price: "99 EUR/mes",
        features: ["CRM", "WhatsApp", "Lista de espera"],
      },
      {
        name: "Business",
        price: "199 EUR/mes",
        features: ["Analytics avancado", "Loyalty", "API"],
      },
    ],
  },
  "en-GB": {
    appName: "Rest.AG",
    tagline: "Restaurant reservations platform",
    heroTitle: "Bookings, floor plan and CRM in one cockpit",
    heroSubtitle:
      "Replace manual books with real-time operations, automation and predictable growth.",
    ctaPrimary: "Open Demo Dashboard",
    ctaSecondary: "View Public Widget",
    statsLabel: "MVP under wave-based delivery",
    pricingTitle: "Subscription plans",
    pricingSubtitle: "Monthly fee per restaurant plus optional modules.",
    plans: [
      {
        name: "Starter",
        price: "49 EUR/month",
        features: ["Bookings", "Widget", "Basic email"],
      },
      {
        name: "Pro",
        price: "99 EUR/month",
        features: ["CRM", "WhatsApp", "Waitlist"],
      },
      {
        name: "Business",
        price: "199 EUR/month",
        features: ["Advanced analytics", "Loyalty", "API"],
      },
    ],
  },
  "es-ES": {
    appName: "Rest.AG",
    tagline: "Sistema de reservas para restaurantes",
    heroTitle: "Reservas, sala y CRM en un unico cockpit",
    heroSubtitle:
      "Sustituye el libro manual por operacion en tiempo real, automatizacion y crecimiento predecible.",
    ctaPrimary: "Abrir Dashboard Demo",
    ctaSecondary: "Ver Widget Publico",
    statsLabel: "MVP construido por waves",
    pricingTitle: "Planes de suscripcion",
    pricingSubtitle: "Precio mensual por restaurante con modulos opcionales.",
    plans: [
      {
        name: "Starter",
        price: "49 EUR/mes",
        features: ["Reservas", "Widget", "Email basico"],
      },
      {
        name: "Pro",
        price: "99 EUR/mes",
        features: ["CRM", "WhatsApp", "Lista de espera"],
      },
      {
        name: "Business",
        price: "199 EUR/mes",
        features: ["Analytics avanzado", "Loyalty", "API"],
      },
    ],
  },
};

export function getRestDictionary(locale: RestLocale): RestDictionary {
  return dictionaries[locale];
}
