import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-[#e2f2d0]/40 backdrop-blur-md border-t border-white/60 mt-auto relative z-10">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Copyright */}
        <span className="text-xs text-slate-600 font-bold tracking-wide">
          © {new Date().getFullYear()} Qurevo Technologies. All rights reserved.
        </span>

        {/* Legal Links */}
        <nav className="flex items-center space-x-6 text-xs font-bold text-slate-600 font-['Familjen_Grotesk'] uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">
            Terms & Conditions
          </Link>
        </nav>

        {/* Location & Love Badge */}
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-700 font-extrabold bg-[#b8f4f5] border border-white/80 px-4 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5">
          <span className="tracking-wide uppercase">Made with ❤️ in </span>
          <span className="animate-pulse text-black text-sm drop-shadow-sm">Kashmir</span>
        </div>

      </div>
    </footer>
  );
}