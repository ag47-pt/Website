import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    default: `${site.name} (${site.ticker}) · The infrastructure layer for decentralized intelligence`,
    template: `%s · ${site.ticker}`,
  },
  description:
    "AGI is the metering and settlement asset of the AG47 Cognitive Organism — a network of specialized AI agents that ingest data, cross-verify each other and return structured intelligence.",
  keywords: [
    "AG Intelligence Token",
    "AGI token",
    "decentralized AI",
    "AI agents",
    "Proof of Intelligence",
    "Solana",
    "AG47",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} (${site.ticker})`,
    description: site.tagline,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} (${site.ticker})`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030309",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
