"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Packages', href: '#packages' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 md:px-8 pointer-events-none">
      <nav 
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between rounded-full border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-full
        ${scrolled 
          ? 'max-w-5xl px-6 py-3 bg-[#e2f2d0]/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-white/40 translate-y-0' 
          : 'max-w-[96rem] px-8 py-4 bg-[#e2f2d0]/80 backdrop-blur-md shadow-sm border-white/20'}`}
      >
        {/* Logo - Added nav-target for magnet effect */}
        <Link href="/" className="nav-target flex items-center space-x-3 group outline-none rounded-lg p-1" aria-label="Qurevo Technologies Home">
          <Image 
            src="/logo.png" 
            alt="Qurevo Technologies Logo" 
            width={48} 
            height={48} 
            className="w-10 h-auto md:w-12 transition-transform duration-300 group-hover:scale-105" 
            priority
          />
          <span className="text-[1.1rem] md:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-sky-400 drop-shadow-sm group-hover:brightness-110 transition-all duration-300">
            Qurevo Technologies
          </span>
        </Link>

        {/* Desktop Navigation Links - Added nav-target for magnet effect */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="nav-target text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 relative group outline-none"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </div>

        {/* Action Button - Added nav-target for magnet effect */}
        <div className="hidden md:block">
          <Link 
            href="#book" 
            className="nav-target bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-0.5 outline-none"
          >
            <span>Book Website</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle - Added nav-target */}
        <button 
          className="nav-target md:hidden p-2 text-slate-900 outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 bg-[#e2f2d0]/95 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl z-40 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="nav-target text-lg font-bold text-slate-900 block"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="#book"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-target bg-blue-600 text-white font-bold text-center py-3 rounded-full"
          >
            Book Website
          </Link>
        </div>
      )}
    </header>
  );
}