"use client";

import React from "react";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section id="about" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* SEO Optimized Text Column */}
          <article className="space-y-6 md:space-y-8">
            <header>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full font-['Familjen_Grotesk'] shadow-sm">
                About The Company
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-6 tracking-tight leading-tight">
                Emerging. Trustworthy. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-['Foldit'] tracking-wide">
                  Qurevo Technologies.
                </span>
              </h2>
            </header>

            <div className="space-y-5 text-slate-600 text-lg leading-relaxed font-medium">
              <p>
                Founded by <strong>Haadi Sabzar</strong>, <strong>Qurevo Technologies</strong> (formerly Qurevo) has rapidly established itself as an emerging and trustworthy modern company. We specialize in high-performance <strong>Web Development</strong>, advanced <strong>SEO Optimization</strong>, and building scalable software products tailored for the digital age.
              </p>
              <p>
                Beyond code, we bring visual stories to life. Qurevo offers premium <strong>Video Editing Services</strong>, utilizing industry-leading professional software including <strong>Adobe Premiere Pro, DaVinci Resolve, and CapCut</strong>. Whether it is brand storytelling or modern digital content, our post-production team delivers cinematic quality.
              </p>
            </div>
          </article>

          {/* Team / Avatars Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Haadi Sabzar - Founder */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] mb-5 shadow-md">
                <div className="w-full h-full bg-white rounded-full overflow-hidden relative">
                  <Image 
                    src="/haadi-sabzar-founder-qurevotechnologies-icon.png"
                    alt="Haadi Sabzar - Founder and CEO of Qurevo Technologies"
                    width={1215}
                    height={1145}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Haadi Sabzar</h3>
              <p className="text-sm text-blue-600 font-semibold mt-1 uppercase tracking-wider font-['Familjen_Grotesk']">
                Founder & Lead Dev
              </p>
              <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                Driving technical excellence, SEO strategy, and software innovation at Qurevo.
              </p>
            </div>

            {/* Video Editor - Lead */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px] mb-5 shadow-md">
                <div className="w-full h-full bg-white rounded-full overflow-hidden relative">
                  {/* TODO: Replace src with your video editor's actual image path */}
                  <Image 
                    src="/icons/vyenor-qurevo-video-editor.png" 
                    alt="Professional Video Editor at Qurevo Technologies"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              {/* TODO: Replace with actual name */}
              <h3 className="text-xl font-bold text-slate-900">Vyenor - Qurevo's Professional Video Editor</h3>
              <p className="text-sm text-purple-600 font-semibold mt-1 uppercase tracking-wider font-['Familjen_Grotesk']">
                Head of Post-Production
              </p>
              <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                Crafting visual masterpieces using Premiere Pro and DaVinci Resolve.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}