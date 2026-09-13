import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/date', '/laura'],
      },
    ],
    sitemap: 'https://ag47.pt/sitemap.xml',
    host: 'https://ag47.pt',
  }
}
