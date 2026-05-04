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
  title: {
    default: "AG47 | Agência Full Service - Criação de Sites, SaaS e Tráfego Pago",
    template: "%s | AG47"
  },
  description: "Agência especializada em Criação de Sites, WebApps, Micro-SaaS e Tráfego Pago com foco em ROI e Design 3D Exclusivo. Atendimento em Portugal e Brasil.",
  keywords: ["Criação de Sites", "Landing Page", "Sistemas Web", "Webapps", "Micro-Saas", "Tráfego Pago", "Agência Full Service", "Marketing Digital Brasil", "Marketing Digital Portugal", "Design 3D", "ROI"],
  authors: [{ name: "Agência 47" }],
  creator: "Agência 47",
  publisher: "Agência 47",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AG47 | Agência Full Service",
    description: "Design 3D Exclusivo, Desenvolvimento Ultra-rápido e Foco Total em ROI.",
    url: "https://ag47.pt",
    siteName: "AG47",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AG47 - Agência Full Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AG47 | Agência Full Service",
    description: "Conduzindo sua marca ao próximo nível com tecnologia e design de ponta.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
