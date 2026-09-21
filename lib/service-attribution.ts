const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export function serviceAttribution(search: string): string {
  const input = new URLSearchParams(search)
  const result = new URLSearchParams()
  for (const key of UTM_KEYS) {
    const value = input.get(key)
    if (value) result.set(key, value)
  }
  return result.toString()
}

export function withServiceAttribution(href: string, search: string): string {
  const url = new URL(href, 'https://ag47.pt')
  new URLSearchParams(serviceAttribution(search)).forEach((value, key) => url.searchParams.set(key, value))
  return `${url.pathname}${url.search}${url.hash}`
}

export function serviceContactHref(service: string, offer?: string, search = ''): string {
  const subject = `Pedido de informação — ${service}${offer ? ` — ${offer}` : ''}`
  const origin = serviceAttribution(search)
  const body = `Olá! Gostaria de saber mais sobre ${service}${offer ? `: ${offer}` : ''}.\n\nO meu negócio:\nO que preciso:\n${origin ? `\nOrigem: ${origin}\n` : ''}`
  return `mailto:contacto@ag47.pt?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
