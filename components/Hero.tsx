import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 flex flex-col items-start space-y-7 pl-0 xl:pl-8">
          
          {/* Badge using Familjen Grotesk for a crisp, modern UI feel */}
          <div className="flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 shadow-sm font-['Familjen_Grotesk']">
            <span className="text-blue-600 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span>🛡️</span> Trusted by 25+ Happy Clients
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            We Build Websites <br />
            That Build <br className="sm:hidden" />
            {/* Headline accent using Satisfy as a beautiful cursive highlight */}
            <span className="text-gradient font-['Satisfy'] font-normal tracking-normal text-6xl md:text-7xl lg:text-8xl inline-block mt-2 md:mt-0">
              Your Brand.
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            At Qurevo Technologies, we turn ideas into high performance websites that are fast, modern and results driven.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((img) => (
                <div key={img} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm" />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400 text-sm">★</span>
                ))}
                {/* 5.0 Rating using Familjen Grotesk for bold data display */}
                <span className="text-lg font-black text-slate-800 ml-1 font-['Familjen_Grotesk']">5.0</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Loved by clients worldwide</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="#book" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-full flex items-center space-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/25 transform hover:-translate-y-0.5">
              <span>Book Website</span>
              <span>→</span>
            </Link>
            <Link href="#projects" className="border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-full flex items-center space-x-2 transition-all duration-300 bg-white hover:bg-slate-50 shadow-sm">
              <span>View Our Work</span>
              <span className="text-xs text-slate-400">↗</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center relative mt-12 lg:mt-0">
          <div className="relative w-full max-w-[28rem] aspect-square flex flex-col items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-300/10 rounded-full filter blur-[60px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[60px] animate-pulse delay-700" />
            
            <div className="z-10 animate-float mb-6">
              <Image 
                src="/logo.png" 
                alt="Qurevo Technologies Logo" 
                width={300} 
                height={300} 
                className="w-56 md:w-72 h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
            
            <div className="absolute bottom-12 w-64 md:w-80 h-10 rounded-[100%] bg-gradient-to-b from-white/90 to-slate-100/40 border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm flex items-center justify-center transition-transform duration-700">
              <div className="w-[85%] h-[50%] rounded-[100%] bg-white/80 shadow-[inset_0_-2px_10px_rgba(255,255,255,1)] blur-[0.5px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-slate-100/80 bg-slate-50/50 mt-16 py-8">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Modern & Clean Design", desc: "Pixel perfect & responsive", icon: "✏️" },
            { title: "Lightning Fast", desc: "Optimized for speed", icon: "⚡" },
            { title: "SEO Friendly", desc: "Built to rank higher", icon: "🔍" },
            { title: "Secure & Reliable", desc: "Your data is safe", icon: "🛡️" }
          ].map((feat, i) => (
            <div key={i} className="flex items-start space-x-4 group justify-center lg:justify-start">
              <div className="bg-white p-3.5 rounded-2xl text-xl shadow-sm border border-slate-100 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 flex-shrink-0">
                {feat.icon}
              </div>
              <div className="flex flex-col justify-center pt-1">
                {/* Foldit applied to the title */}
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 font-['Foldit'] tracking-wide">
                  {feat.title}
                </h4>
                {/* Story Script applied to the description */}
                <p className="text-sm text-slate-500 font-['Story_Script'] tracking-wide">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}