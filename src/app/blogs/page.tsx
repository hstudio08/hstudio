import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getBlogs } from "../../lib/mdx";

export const metadata: Metadata = {
  title: "Blogs | Qurevo Technologies - Web Design & SEO Insights",
  description: "Read daily insights, tutorials, and strategies on web development, SEO, and digital growth from Haadi Sabzar, Founder of Qurevo Technologies.",
};

export default function BlogsPage() {
  const blogs = getBlogs();

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-[96rem] mx-auto w-full z-10 flex-grow">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Latest <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 font-medium">
            Daily web development and SEO strategies from Kashmir's leading digital agency.
          </p>
        </div>

        {/* HIGHLY OPTIMIZED GRID: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {blogs.map((post) => (
            <article key={post.slug} className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <Link href={`/blogs/${post.slug}`} className="relative h-28 sm:h-40 w-full overflow-hidden block bg-slate-100 shrink-0">
                <Image 
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <div className="p-3 sm:p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                  <span className="text-[8px] sm:text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm uppercase tracking-wider">
                    {post.frontmatter.tags?.[0] || "ARTICLE"}
                  </span>
                  <time className="text-[9px] sm:text-[11px] text-slate-500 font-medium ml-auto">
                    {new Date(post.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>
                
                <Link href={`/blogs/${post.slug}`}>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {post.frontmatter.title}
                  </h2>
                </Link>
                {/* Hide description on mobile to save space, show on sm+ screens */}
                <p className="hidden sm:block text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {post.frontmatter.description}
                </p>
                
                {/* Author Info */}
                <div className="mt-auto pt-2 sm:pt-3 sm:border-t border-slate-100 flex items-center gap-2">
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <Image 
                      src={post.frontmatter.authorImage} 
                      alt={post.frontmatter.author} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[11px] font-bold text-slate-900 leading-tight">{post.frontmatter.author}</span>
                    <span className="hidden sm:inline-block text-[8px] sm:text-[9px] text-slate-500 leading-tight">Expert Insights</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}