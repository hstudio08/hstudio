"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import PillNav from '../effects/PillNav';
import BubbleMenu from '../effects/BubbleMenu';
import BookingModal from './BookingModal';

// 👇 ONE SHORT COMMAND TO TURN ON/OFF THE AUTO POPUP 👇
const ENABLE_AUTO_POPUP = false; // Change this to `true` to turn it back on

let popupTriggeredThisVisit = false;

export default function Navbar() {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  useEffect(() => {
    // The timer will only run if ENABLE_AUTO_POPUP is true
    if (ENABLE_AUTO_POPUP && !popupTriggeredThisVisit) {
      const timer = setTimeout(() => {
        setIsBookingOpen(true);
        popupTriggeredThisVisit = true;
      }, 2500); 
      
      return () => clearTimeout(timer); 
    }
  }, []);

  const isHome = pathname === '/' || pathname === '/home';

  const navLinks = useMemo(() => {
    return [
      { label: 'Home', href: '/home', rotation: -5 }, 
      ...(isHome ? [
        { label: 'Projects', href: '#projects', rotation: 4 },
        { label: 'Packages', href: '#packages', rotation: -3 },
      ] : []),
      { label: 'Who we are?', href: '/about', rotation: 3 },
      { label: 'Blogs', href: '/blogs', rotation: -4 },
      { label: 'Careers', href: '/careers', rotation: 2 },
    ];
  }, [isHome]);

  const bubbleMenuLinks = useMemo(() => {
    return navLinks.map(link => ({
      ...link,
      hoverStyles: { bgColor: '#f0f9ff', textColor: '#2563eb' }
    }));
  }, [navLinks]);

  const BookButton = (
    <button 
      onClick={() => setIsBookingOpen(true)}
      className="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-600 text-white font-black uppercase tracking-widest text-[11px] md:text-xs px-5 py-2 md:px-6 md:py-2.5 rounded-full shadow-lg shadow-blue-500/20 border border-white/20 transform hover:-translate-y-0.5 transition-all duration-300 font-['Familjen_Grotesk'] outline-none whitespace-nowrap"
    >
      BOOK
    </button>
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);

  useEffect(() => {
    const checkBg = () => {
      // Find all elements explicitly marked as dark theme
      const darkElements = document.querySelectorAll('[data-theme="dark"]');
      let isOverDark = false;
      
      for (const el of darkElements) {
        const rect = el.getBoundingClientRect();
        // The navbar is fixed near the top (around top 16px to 24px)
        // Check if the 50px line (center of navbar) intersects this dark element
        if (rect.top <= 50 && rect.bottom >= 50) {
          isOverDark = true;
          break;
        }
      }
      
      setIsDarkBg(isOverDark);
    };

    window.addEventListener('scroll', checkBg, { passive: true });
    // Check initially
    setTimeout(checkBg, 100);
    return () => window.removeEventListener('scroll', checkBg);
  }, [pathname]);

  const textColorClass = isDarkBg ? 'text-white' : 'text-[#0f172a]';
  const hoverBgClass = isDarkBg ? 'hover:bg-white/20 active:bg-white/40' : 'hover:bg-[#0f172a]/5 active:bg-[#0f172a]/10';
  const borderColorClass = isDarkBg ? 'hover:border-white/40' : 'hover:border-[#0f172a]/20';
  const hamburgerBgClass = isDarkBg ? 'bg-white' : 'bg-[#0f172a]';

  return (
    <>
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="relative w-full max-w-5xl pointer-events-auto">
          {/* Glass Backdrop */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-900/10 transition-colors duration-300"></div>
          
          <nav className="relative z-10 flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 w-full">
            
            <Link href={navLinks[0]?.href || '/'} className="flex items-center">
              <img src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp" alt="Qurevo Technologies Logo" className="w-9 h-9 md:w-11 md:h-11 object-contain" />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className={`block px-4 py-2 rounded-full border border-transparent ${borderColorClass} ${hoverBgClass} active:scale-95 text-[14px] font-['Familjen_Grotesk'] font-extrabold uppercase tracking-wider transition-all duration-300 ease-out ${textColorClass}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Action Button & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {BookButton}
              <button 
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className={`h-[2px] w-5 rounded transition-transform duration-300 ${hamburgerBgClass} ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                <span className={`h-[2px] w-5 rounded transition-opacity duration-300 ${hamburgerBgClass} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`h-[2px] w-5 rounded transition-transform duration-300 ${hamburgerBgClass} ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed top-20 left-4 right-4 z-40 md:hidden bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-2xl transition-all duration-300 ease-in-out transform origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}
      >
        <ul className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <li key={i}>
              <Link 
                href={link.href} 
                className="block px-5 py-3 rounded-2xl bg-white/20 active:bg-white/50 active:scale-[0.98] text-[15px] font-['Familjen_Grotesk'] font-bold text-[#0f172a] uppercase tracking-wide transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 
        ================ OLD NAVBAR BACKUP (DO NOT DELETE) ================
        <div className="hidden md:block">
          <PillNav
            logo="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp"
            logoAlt="Qurevo Technologies Logo"
            items={navLinks}
            activeHref={pathname}
            baseColor="#ffffff" 
            pillColor="transparent" 
            hoveredPillTextColor="#ffffff"
            pillTextColor="#0f172a" 
            actionButton={BookButton}
          />
        </div>

        <div className="block md:hidden">
          <BubbleMenu
            logo={<img src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp" alt="Qurevo Technologies Logo" className="w-8 h-8" />}
            items={bubbleMenuLinks}
            menuBg="#ffffff"
            menuContentColor="#0f172a"
            useFixedPosition={true}
            actionButton={BookButton}
          />
        </div>
        ====================================================================
      */}

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}