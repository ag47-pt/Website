import type { Metadata } from 'next';
import OracleTraderPanel from '@/labs/oracle-trader-footboll/oracle-trader-panel';

export const metadata: Metadata = {
  title: 'Oracle Trader Footbol | Agência 47 Labs',
  description: 'Análise de mercado e trader quantitativo de futebol com cognição preditiva avançada.',
};

export default function OracleTraderPage() {
  return <OracleTraderPanel />;
}
