import { Basic3DScene } from '@/components/Basic3DSceneLoader'

// page.tsx é um Server Component — permite ao Next.js injetar metadata no HTML
// O dynamic import com ssr:false está isolado no Basic3DSceneLoader (Client Component)
export default function Home() {
  return (
    <main className="bg-black">
      <Basic3DScene />
    </main>
  )
}