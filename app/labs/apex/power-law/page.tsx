// Route component for the Bitcoin Power Law documentation landing page
import type { Metadata } from 'next';
import { PowerLawClient } from '@/app/labs/apex/power-law/PowerLawClient';

export const metadata: Metadata = {
  title: 'Bitcoin Power Law Model | Agência 47 Labs',
  description: 'O modelo matemático e físico de Giovanni Santostasi explicativo sobre a evolução termodinâmica e biológica do preço do Bitcoin.',
};

export default function PowerLawPage() {
  return <PowerLawClient />;
}
