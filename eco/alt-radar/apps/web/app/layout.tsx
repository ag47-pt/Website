import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: { default: "AG47 Altcoin Radar", template: "%s · AG47 Radar" },
  description: "Radar read-only de descoberta, risco, scoring explicável e alertas de altcoins.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050b10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-PT">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
