"use client";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck, Zap, Search, Lock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden bg-slate-50/30">
      {/* Background glow effects */}
      <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-[-10%] w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* WIDENED CONTAINER: Changed max-w-7xl to max-w-[1400px] to reduce side margins */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Main Hero Split */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-24">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[55%] flex flex-col items-start text-left"
          >
            {/* Top Badge - Added hover scale */}
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all hover:bg-blue-100 hover:scale-105 cursor-default">
              <ShieldCheck size={16} />
              <span>Trusted by 25+ Happy Clients</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-[4.5rem] xl:text-[5rem] leading-[1.05] font-extrabold text-slate-900 tracking-tight mb-6">
              We Build Websites <br className="hidden md:block" />
              That Build <span className="text-blue-500">Your Brand.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              At H Studios, we turn ideas into high performance websites that are fast, modern and results driven.
            </p>

            {/* Avatars & Rating - Added hover separation on avatars */}
            <div className="flex items-center gap-4 mb-10 group cursor-default">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:z-10 relative">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="group-hover:scale-110 transition-transform delay-75" />
                  ))}
                  <span className="text-slate-900 font-bold ml-1">5.0</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Loved by clients worldwide</p>
              </div>
            </div>
            
            {/* CTA Buttons - Upgraded hover states (glow, lift, border) */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="#contact" className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_10px_30px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                Book a Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#work" className="group flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-200 text-slate-700 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:bg-blue-50/50 hover:-translate-y-1 hover:shadow-lg">
                View Our Work <ExternalLink size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Image + Pedestal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[45%] flex justify-center relative mt-10 lg:mt-0 group"
          >
            <div className="relative w-full max-w-[600px] aspect-square flex flex-col items-center justify-center">
              
              {/* Floating Logo Animation */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative w-full h-full z-10"
              >
                <Image 
                  src="/logo.png" 
                  alt="H Studios 3D Logo" 
                  fill
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] group-hover:scale-[1.03] group-hover:-translate-y-4 transition-all duration-500"
                  priority
                />
              </motion.div>

              {/* 3D Glass Pedestal (Bottom Design) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 sm:h-24 rounded-[100%] bg-gradient-to-b from-white/80 to-blue-50/30 border-2 border-white/60 shadow-[0_20px_50px_rgba(59,130,246,0.15)] backdrop-blur-md flex items-center justify-center -z-0 group-hover:shadow-[0_30px_60px_rgba(59,130,246,0.3)] group-hover:border-blue-100 transition-all duration-500">
                {/* Inner Ring to simulate 3D depth */}
                <div className="w-[85%] h-[70%] rounded-[100%] border border-blue-200/50 bg-white/40 shadow-inner" />
                {/* Bottom ground shadow */}
                <div className="absolute -bottom-6 w-[80%] h-6 bg-blue-900/10 rounded-[100%] blur-md -z-10 group-hover:opacity-60 transition-opacity duration-500" />
              </div>

            </div>
          </motion.div>

        </div>

        {/* Bottom Features Bar - Upgraded to interactive cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-t border-slate-200"
        >
          {/* Feature 1 */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-full text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <Search size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Modern & Clean Design</h3>
              <p className="text-sm text-slate-500 mt-1">Pixel perfect & responsive</p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-full text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Lightning Fast</h3>
              <p className="text-sm text-slate-500 mt-1">Optimized for speed</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-full text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <Search size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">SEO Friendly</h3>
              <p className="text-sm text-slate-500 mt-1">Built to rank higher</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-full text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Secure & Reliable</h3>
              <p className="text-sm text-slate-500 mt-1">Your data is safe</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}