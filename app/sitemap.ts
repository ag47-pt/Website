import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ag47.pt';
  
  // Lista de rotas estáticas
  const routes = [
    '',
    '/servicos/criacao-de-sites',
    '/servicos/landing-pages',
    '/servicos/sistemas-e-webapps',
    '/servicos/micro-saas',
    '/servicos/trafego-pago',
    '/servicos/full-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
