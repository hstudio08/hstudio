"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
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

  // Only use rotation. CSS flex-wrap will handle the layout perfectly.
  const navLinks = useMemo(() => {
    return [
      { label: 'Home', href: '/home', rotation: -5 }, 
      ...(isHome ? [
        { label: 'Projects', href: '#projects', rotation: 4 },
        { label: 'Packages', href: '#packages', rotation: -3 },
      ] : []),
      { label: 'Who we are?', href: '/about', rotation: 3 },
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

  return (
    <>
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

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}