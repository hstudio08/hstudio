"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PillNav from '../effects/PillNav';
import BookingModal from './BookingModal';

// MODULE-LEVEL VARIABLE: 
// This survives when navigating between pages via Next.js links, 
// but it is completely erased and reset to `false` if the user refreshes the page or reopens the tab.
let popupTriggeredThisVisit = false;

export default function Navbar() {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Auto-Popup Logic: Triggers 2.5 seconds after landing or refreshing
  useEffect(() => {
    if (!popupTriggeredThisVisit) {
      const timer = setTimeout(() => {
        setIsBookingOpen(true);
        // Mark as triggered so it doesn't pop up again while they click around the site
        popupTriggeredThisVisit = true;
      }, 2500); // 2.5 seconds
      
      return () => clearTimeout(timer); // Cleanup timer if they navigate away before 2.5s
    }
  }, []);

  // Check if we are on the root homepage or the /home route
  const isHome = pathname === '/' || pathname === '/home';

  // Dynamically build the navigation array based on the route
  const navLinks = [
    { label: 'Home', href: '/home' }, 
    
    // Conditionally add these two ONLY if we are on the home page
    ...(isHome ? [
      { label: 'Projects', href: '#projects' },
      { label: 'Packages', href: '#packages' },
    ] : []),

    { label: 'Who we are?', href: '/about' },
    { label: 'Solutions', href: '/solutions' } 
  ];

  return (
    <>
      {/* 1. The Main Pill Navigation */}
      <PillNav
        logo="/logo.png"
        logoAlt="Qurevo Technologies Logo"
        items={navLinks}
        activeHref={pathname}
        baseColor="#ffffff" 
        pillColor="transparent" 
        hoveredPillTextColor="#ffffff"
        pillTextColor="#0f172a" 
      />

      {/* 2. Manual Trigger Button (Floating Top Right) */}
      <button 
        onClick={() => setIsBookingOpen(true)}
        className="fixed top-4 md:top-6 right-4 md:right-8 z-[100] bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-black uppercase tracking-widest text-[10px] md:text-xs px-5 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-300 font-['Familjen_Grotesk'] outline-none"
      >
        Book Website
      </button>

      {/* 3. The Booking Modal Component */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}