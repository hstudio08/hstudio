import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // TODO: Replace with your actual live domain
  const baseUrl = 'https://hstudios.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}