import type { Metadata } from "next";
import { PitchDeckClient } from "../ag47-lib-pith-deck/PitchDeckClient";

export const metadata: Metadata = {
  title: "Pitch Deck Library — AG47 Labs | Curadoria de Projetos & Narrativas Estratégicas",
  description:
    "Biblioteca visual editorial para explorar pitch decks, cases conceituais, modelos de negócio e apresentações de alta densidade estratégica.",
};

export default function PitchDeckAliasPage() {
  return <PitchDeckClient />;
}
