import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: Replace with your actual live domain (e.g., https://hstudios.in)
  const baseUrl = 'https://hstudios.vercel.app';

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