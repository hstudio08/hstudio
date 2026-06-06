import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-[#e2f2d0]/40 backdrop-blur-md border-t border-white/60 mt-auto">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Copyright */}
        <span className="text-xs text-slate-600 font-bold tracking-wide">
          © {new Date().getFullYear()} Qurevo Technologies. All rights reserved.
        </span>

        {/* Location & Love Badge */}
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-700 font-extrabold bg-[#b8f4f5] border border-white/80 px-4 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5">
          <span className="tracking-wide uppercase">Made with ❤️ in </span>
          <span className="animate-pulse text-black-700 text-sm drop-shadow-sm">Kashmir</span>
        </div>

      </div>
    </footer>
  );
}