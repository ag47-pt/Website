'use client'

import { usePathname } from 'next/navigation'
import { SupportChatbox } from './SupportChatbox'

export function SupportChatboxWrapper() {
  const pathname = usePathname()
  
  // Hide the global Ag47 chatbox on the /restag app since it has its own specialized version
  if (pathname.startsWith('/restag')) {
    return null
  }
  
  return <SupportChatbox />
}
