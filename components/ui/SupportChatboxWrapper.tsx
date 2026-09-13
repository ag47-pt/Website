'use client'

import { usePathname } from 'next/navigation'
import { SupportChatbox } from './SupportChatbox'

export function SupportChatboxWrapper() {
  const pathname = usePathname()
  
  // Hide the global Ag47 chatbox on /restag, /labs/oracle-trader, and private /date / /laura
  if (pathname.startsWith('/restag') || pathname.includes('/oracle-trader') || pathname.startsWith('/date') || pathname.startsWith('/laura')) {
    return null
  }
  
  return <SupportChatbox />
}
