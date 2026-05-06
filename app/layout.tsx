import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agência 47 | Websites, SaaS & Marketing Digital em Portugal",
  description:
    "Catapultamos o teu negócio para o próximo nível. Criamos websites de conversão, SaaS, Social Media e Tráfego Pago com o DNA da tua marca.",
  metadataBase: new URL("https://ag47.pt"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Agência 47 | Websites, SaaS & Marketing Digital",
    description:
      "Websites, SaaS, Social Media e Tráfego Pago. Experiência imersiva 3D que reflete a essência da tua marca.",
    url: "https://ag47.pt",
    siteName: "Agência 47",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "https://www.ag47.pt/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Agência 47 — Experiência Digital Imersiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agência 47 | Websites, SaaS & Marketing Digital",
    description:
      "Catapultamos o teu negócio para o próximo nível com websites, SaaS e marketing de performance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  keywords: [
    "agência digital",
    "agência 47",
    "ag47",
    "ag47.pt",
    "Agencia 47 Portugal",
    "Agencia Digital Portugal",
    "Agencia de Marketing Digital",
    "Agencia de Marketing Digital Portugal",
    "websites Portugal",
    "SaaS",
    "marketing digital",
    "tráfego pago",
    "social media",
    "desenvolvimento web",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.ico",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agência 47',
  url: 'https://ag47.pt',
  logo: 'https://ag47.pt/favicon.ico',
  description:
    'Agência digital especializada em websites de conversão, SaaS, Social Media e Tráfego Pago em Portugal.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PT',
  },
  sameAs: [],
}

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-PT"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-black">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
