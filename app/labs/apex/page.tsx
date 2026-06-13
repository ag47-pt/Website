import type { Metadata } from 'next';
import { ApexClient } from './ApexClient';

export const metadata: Metadata = {
  title: 'APEX Predictor | Agência 47 Labs',
  description: 'Previsões do mercado BTC baseadas em análise avançada de sinais semanais, mensais e anuais.',
};

export default function ApexPage() {
  return <ApexClient />;
}
