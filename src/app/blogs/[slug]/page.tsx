import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { getBlogs, getBlogBySlug } from "../../../lib/mdx";
import BlogSidebarPackages from "../../../../components/BlogSidebarPackages"; // <-- NEW IMPORT

// 1. Static Params for speed
export async function generateStaticParams() {
  const blogs = getBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

// Next.js 15+ requires params to be a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// 2. Highly Specific SEO Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const blog = getBlogBySlug(slug);
  if (!blog) return { title: "Post Not Found" };

  return {
    title: `${blog.frontmatter.title} | Blogs - Qurevo`,
    description: blog.frontmatter.description,
    authors: [{ name: blog.frontmatter.author }],
    openGraph: {
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      type: "article",
      publishedTime: blog.frontmatter.date,
      authors: [blog.frontmatter.author],
      images: [blog.frontmatter.image],
    },
  };
}

// 3. Custom MDX Components for Styling
const mdxComponents = {
  BlogImage: ({ src, alt, aspect = "video", align = "center", caption }: any) => {
    const aspectClasses = { video: "aspect-video", square: "aspect-square", portrait: "aspect-[4/5]" };
    const alignClasses = { left: "mr-auto", center: "mx-auto", right: "ml-auto" };
    return (
      <figure className={`my-8 w-full ${alignClasses[align as keyof typeof alignClasses]}`}>
        <div className={`relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 ${aspectClasses[aspect as keyof typeof aspectClasses]}`}>
          <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
        </div>
        {caption && <figcaption className="text-center text-sm text-slate-500 mt-3 font-medium">{caption}</figcaption>}
      </figure>
    );
  },
  CustomVideo: ({ src, poster }: any) => (
    <div className="my-8 rounded-2xl overflow-hidden shadow-lg aspect-video bg-slate-900 border border-slate-800 relative group">
      <video src={src} poster={poster} controls className="w-full h-full object-cover" />
    </div>
  ),
  Highlight: ({ children, color = "yellow" }: any) => {
    const colorMap = { yellow: "bg-yellow-200 text-yellow-900", blue: "bg-blue-200 text-blue-900", emerald: "bg-emerald-200 text-emerald-900" };
    return <span className={`px-1.5 py-0.5 rounded-md font-bold ${colorMap[color as keyof typeof colorMap]}`}>{children}</span>;
  },
  GlowText: ({ children }: any) => (
    <span className="relative inline-block font-extrabold text-blue-600">
      <span className="absolute inset-0 bg-blue-400 blur-md opacity-40"></span>
      <span className="relative z-10">{children}</span>
    </span>
  ),
  Underline: ({ children, style = "solid", color = "blue" }: any) => {
    const styles = { solid: "underline decoration-2", wavy: "underline decoration-wavy decoration-2", dashed: "underline decoration-dashed decoration-2" };
    const colors = { blue: "decoration-blue-500", red: "decoration-red-500", emerald: "decoration-emerald-500" };
    return <span className={`${styles[style as keyof typeof styles]} ${colors[color as keyof typeof colors]} underline-offset-4 font-semibold`}>{children}</span>;
  },
  CalloutFont: ({ children }: any) => (
    <div className="font-['Satisfy'] text-2xl md:text-3xl text-blue-700 my-8 pl-6 border-l-4 border-sky-400 leading-relaxed bg-sky-50/50 py-4 pr-4 rounded-r-xl">
      {children}
    </div>
  ),
  TwoColumn: ({ children }: any) => <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 items-start">{children}</div>,
  Column: ({ children }: any) => <div className="flex flex-col space-y-4">{children}</div>,
};

// 4. Main Page Component
export default async function SingleBlogPost({ params }: Props) {
  const { slug } = await params;
  
  const blog = getBlogBySlug(slug);
  if (!blog) return notFound();

  // Fetch all blogs, remove the current one, and grab top 4 for the sidebar
  const allBlogs = getBlogs();
  const moreBlogs = allBlogs.filter(b => b.slug !== slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.frontmatter.title,
    "image": blog.frontmatter.image,
    "datePublished": blog.frontmatter.date,
    "author": { "@type": "Person", "name": blog.frontmatter.author },
    "description": blog.frontmatter.description
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-200">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-28 md:pt-36 pb-16 px-4 sm:px-6 md:px-8 max-w-[96rem] mx-auto w-full z-10 flex-grow">
        
        {/* Responsive 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ======================================= */}
          {/* LEFT SIDEBAR: Web Dev Packages (Client Component) */}
          {/* ======================================= */}
          <BlogSidebarPackages />


          {/* ======================================= */}
          {/* CENTER: Main Blog Content */}
          {/* ======================================= */}
          <article className="lg:col-span-6 order-1 lg:order-2 bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex-wrap gap-2">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
              <span>/</span>
              <span className="text-slate-800 truncate max-w-[150px] sm:max-w-[200px] inline-block">{blog.frontmatter.title}</span>
            </nav>

            <header className="mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
                {blog.frontmatter.title}
              </h1>
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3">
                  <Image 
                    src={blog.frontmatter.authorImage} alt={blog.frontmatter.author} width={40} height={40} 
                    className="rounded-full shadow-sm border border-slate-200 object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{blog.frontmatter.author}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {new Date(blog.frontmatter.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* MDX Content */}
            <div className="prose prose-slate prose-base sm:prose-lg max-w-none prose-headings:font-black prose-a:text-blue-600">
              <MDXRemote source={blog.content} components={mdxComponents} />
            </div>
          </article>


          {/* ======================================= */}
          {/* RIGHT SIDEBAR: More Blogs */}
          {/* ======================================= */}
          <aside className="lg:col-span-3 order-2 lg:order-3 lg:sticky lg:top-32 mt-8 lg:mt-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Read More Blogs
              </h3>
              
              {moreBlogs.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {moreBlogs.map((post) => (
                    <Link key={post.slug} href={`/blogs/${post.slug}`} className="group flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <Image 
                          src={post.frontmatter.image} alt={post.frontmatter.title} fill sizes="80px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">{post.frontmatter.tags?.[0] || "ARTICLE"}</span>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {post.frontmatter.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No other blogs available yet.</p>
              )}
              
              {/* View All Button */}
              <Link href="/blogs" className="mt-6 block w-full text-center py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors border border-slate-200 hover:border-blue-200">
                View All Articles
              </Link>
            </div>
          </aside>

        </div>
      </div>
      <Footer />
    </main>
  );
}