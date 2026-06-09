import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const root = process.cwd();
const blogsDirectory = path.join(root, 'src', 'content', 'blogs');

export interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  image: string;
  author: string;
  authorImage: string;
  tags: string[];
}

export const getBlogs = () => {
  // Check if directory exists, if not, return empty array
  if (!fs.existsSync(blogsDirectory)) return [];

  const files = fs.readdirSync(blogsDirectory);

  const blogs = files
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace('.mdx', '');
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data } = matter(fileContents);

      return {
        slug,
        frontmatter: data as BlogFrontmatter,
      };
    })
    .sort((a, b) => (new Date(a.frontmatter.date) < new Date(b.frontmatter.date) ? 1 : -1));

  return blogs;
};

export const getBlogBySlug = (slug: string) => {
  const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as BlogFrontmatter,
    content,
    slug,
  };
};