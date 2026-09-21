'use client'

import { useSyncExternalStore, type ComponentProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { serviceContactHref, withServiceAttribution } from '@/lib/service-attribution'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

function useOrigin() {
  usePathname()
  return useSyncExternalStore(subscribe, () => window.location.search, () => '')
}

export function AttributionLink({ href, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const search = useOrigin()
  return <Link {...props} href={withServiceAttribution(href, search)} />
}

export function ServiceContactLink({ service, offer, ...props }: ComponentProps<'a'> & { service: string; offer?: string }) {
  const search = useOrigin()
  return <a {...props} href={serviceContactHref(service, offer, search)} />
}
