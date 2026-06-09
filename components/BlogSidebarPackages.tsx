"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BlogSidebarPackages() {
  const router = useRouter();

  // Dispatches the custom event and redirects to the booking section
  const handleGetStarted = (e: React.MouseEvent, tierName: string) => {
    e.preventDefault();
    const mappedValue = tierName === 'Starter' ? 'Starter - ₹10,000' :
                        tierName === 'Growth' ? 'Growth - ₹15,000' :
                        'Premium - ₹20,000';

    // 1. Dispatch event in case the modal is global (e.g., inside Navbar)
    window.dispatchEvent(new CustomEvent('preselectPackage', { detail: mappedValue }));
    
    // 2. Navigate to the page where the booking form/modal exists
    const bookElement = document.getElementById('book');
    if (bookElement) {
      bookElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If the user is on the blog page, redirect them to the home page's booking section
      router.push('/#book'); 
    }
  };

  return (
    <aside className="lg:col-span-3 order-3 lg:order-1 lg:sticky lg:top-32 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#a7fcfb]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Web Packages
        </h3>
        
        <div className="space-y-3">
          
          {/* Starter Package */}
          <div 
            onClick={(e) => handleGetStarted(e, 'Starter')} 
            className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors group cursor-pointer"
          >
            <h4 className="text-white font-bold text-sm">Starter</h4>
            <p className="text-slate-400 text-xs mt-1 mb-2 line-clamp-2 font-medium">₹10,000 • Perfect for startups & individuals</p>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-white">Get Quote →</span>
          </div>
          
          {/* Growth Package */}
          <div 
            onClick={(e) => handleGetStarted(e, 'Growth')} 
            className="bg-[#a7fcfb]/10 p-4 rounded-xl border border-[#a7fcfb]/40 hover:border-[#a7fcfb]/80 transition-colors group cursor-pointer relative overflow-hidden"
          >
            <h4 className="text-white font-bold text-sm">Growth</h4>
            <p className="text-sky-100/70 text-xs mt-1 mb-2 line-clamp-2 font-medium">₹15,000 • Best for growing businesses</p>
            <span className="text-[10px] font-bold text-[#a7fcfb] uppercase tracking-wider group-hover:text-white">Get Quote →</span>
          </div>

          {/* Premium Package */}
          <div 
            onClick={(e) => handleGetStarted(e, 'Premium')} 
            className="bg-gradient-to-br from-[#a7fcfb] to-[#b4f7ab] p-4 rounded-xl border border-transparent shadow-[0_10px_20px_rgba(167,252,251,0.15)] hover:scale-[1.02] transition-transform group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-slate-950 text-[#b4f7ab] text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Popular</div>
            <h4 className="text-slate-950 font-black text-sm">Premium</h4>
            <p className="text-slate-800 text-xs mt-1 mb-2 line-clamp-2 font-semibold">₹20,000 • For brands that want the best</p>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider group-hover:text-slate-700">Get Quote →</span>
          </div>

        </div>
      </div>
    </aside>
  );
}