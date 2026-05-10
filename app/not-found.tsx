import { NotFoundScene } from '@/components/NotFoundSceneLoader'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página Não Encontrada | Agência 47',
  description: 'Parece que te perdeste no vácuo digital. O que procuras está em um buraco negro.',
  robots: { index: false, follow: true }
}

export default function NotFound() {
  return (
    <main className="bg-black">
      <NotFoundScene />
    </main>
  )
}
