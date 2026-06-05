"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 md:px-8 pointer-events-none">
      <nav 
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between rounded-full border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-full
        ${scrolled 
          ? 'max-w-5xl px-6 py-3 bg-[#e2f2d0]/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-white/40 translate-y-0' 
          : 'max-w-[96rem] px-8 py-4 bg-[#e2f2d0]/80 backdrop-blur-md shadow-sm border-white/20'}`}
      >
        {/* Logo & Brand Name */}
        <Link href="/" className="flex items-center space-x-3 group" aria-label="H Studios Home">
          <Image 
            src="/logo.png" 
            alt="H Studios Web Development Agency Logo" 
            width={48} 
            height={48} 
            className="w-10 h-auto md:w-12 transition-transform duration-300 group-hover:scale-105" 
            priority
          />
          <span className="hidden sm:block text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
            H &bull; Studios
          </span>
        </Link>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          {['Projects', 'Packages'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div>
          <Link href="#book" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-0.5">
            <span>Book Website</span>
            <span className="text-base leading-none" aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}