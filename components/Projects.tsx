"use client";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

const projects = [
  { title: "Fintech Dashboard", desc: "A modern SaaS dashboard for a crypto startup.", color: "bg-blue-100" },
  { title: "E-Commerce Store", desc: "High-conversion headless Shopify storefront.", color: "bg-sky-100" },
  { title: "AI Writing Tool", desc: "Landing page for an AI-powered copywriting app.", color: "bg-indigo-100" }
];

export default function Projects() {
  return (
    <section id="work" className="py-24 px-6 md:px-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Featured Projects</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Real results for real businesses.</p>
        </div>

        {/* Trust Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 border-b border-slate-200 pb-12">
          <div className="text-center"><h3 className="text-4xl font-bold text-brand-500">25+</h3><p className="text-slate-500 text-sm mt-1">Happy Clients</p></div>
          <div className="text-center"><h3 className="text-4xl font-bold text-brand-500">30+</h3><p className="text-slate-500 text-sm mt-1">Projects Shipped</p></div>
          <div className="text-center"><h3 className="text-4xl font-bold text-brand-500">100%</h3><p className="text-slate-500 text-sm mt-1">Satisfaction Rate</p></div>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {projects.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 group hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-full h-48 rounded-xl mb-6 ${p.color} flex items-center justify-center`}>
                <span className="text-slate-400 text-sm">Project Preview</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-slate-600 mb-6 text-sm">{p.desc}</p>
              <button className="flex items-center gap-2 text-brand-600 font-medium text-sm group-hover:text-brand-700">
                View Project <ExternalLink size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-8 border-t-4 border-t-brand-500">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div>
              <p className="text-slate-700 italic mb-6">"H Studios transformed our online presence completely. Haadi and the team delivered a stunning website that doubled our conversion rate in just one month."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Client Name</h4>
                  <p className="text-slate-500 text-xs">CEO, Tech Corp</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}