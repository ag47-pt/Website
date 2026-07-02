'use client'

import { usePathname } from 'next/navigation'
import { SupportChatbox } from './SupportChatbox'

export function SupportChatboxWrapper() {
  const pathname = usePathname()
  
  // Hide the global Ag47 chatbox on the /restag and /labs/oracle-trader
  if (pathname.startsWith('/restag') || pathname.includes('/oracle-trader')) {
    return null
  }
  
  return <SupportChatbox />
}
