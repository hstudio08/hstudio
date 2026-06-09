import { MetadataRoute } from 'next';
import { getBlogs } from '../lib/mdx'; // Ensure this path matches your project structure

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://qurevo.in';

  // 1. Define Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Daily since you plan to update blogs often
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    }
    // Note: We intentionally exclude the /admin route from the sitemap
    // so search engines do not attempt to index your secure backend.
  ];

  // 2. Dynamically fetch and generate Blog Routes
  const blogs = getBlogs();
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    // Use the exact date the blog was published from your MDX frontmatter
    lastModified: new Date(blog.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.7, // 0.7 is perfect for standard blog posts
  }));

  // 3. Combine and return all routes to Next.js
  return [...staticRoutes, ...blogRoutes];
}