import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Updated to the expected new Vercel domain
  const baseUrl = 'https://qurevo.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Note: We intentionally exclude the /admin route from the sitemap
    // so search engines do not attempt to index your secure backend.
  ];
}