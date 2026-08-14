import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pitch Deck Library — AG47 Labs | Curadoria de Projetos & Narrativas Estratégicas",
  description:
    "Biblioteca visual editorial para explorar pitch decks, cases conceituais, modelos de negócio e apresentações de alta densidade estratégica.",
  keywords: [
    "Pitch Deck",
    "Agência 47",
    "Startups",
    "Inteligência Artificial",
    "Branding",
    "Apresentações",
    "Venture Capital",
    "Estratégia",
  ],
  authors: [{ name: "Agência 47 Labs" }],
  openGraph: {
    title: "Pitch Deck Library — AG47 Labs",
    description: "Mural editorial de pitch decks e narrativas estratégicas.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#090a0d] text-[#f5f2eb] antialiased selection:bg-[#ff5722] selection:text-white">
        {children}
      </body>
    </html>
  );
}
