import { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import { InvitationExperience } from '@/components/invitation/InvitationExperience'
import { lauraInvitationConfig } from '@/lib/invitations/laura-config'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Um Convite',
  description: 'Acesso confidencial e privado.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
}

export default function DateInvitationPage() {
  return (
    <div
      className={`${cormorant.variable} w-full min-h-[100dvh] bg-[#050505] selection:bg-rose-900/60 selection:text-white`}
      style={
        {
          '--font-serif': 'var(--font-cormorant), Georgia, serif',
        } as React.CSSProperties
      }
    >
      <InvitationExperience config={lauraInvitationConfig} />
    </div>
  )
}
