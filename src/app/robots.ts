import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Updated to the expected new Vercel domain
  const baseUrl = 'https://qurevo.in';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}