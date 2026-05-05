import { Metadata } from 'next'
import ServicosClient from './ServicosClient'

export const metadata: Metadata = {
  title: 'Serviços | Agência 47',
  description:
    'Websites, SaaS, Social Media e Tráfego Pago. Vê todos os serviços da Agência 47 e escolhe o que vai catapultar o teu negócio.',
  alternates: { canonical: '/servicos' },
}

export default function ServicosPage() {
  return <ServicosClient />
}
