"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const MOBILE_BREAKPOINT = 768;
const DEFAULT_GLOW_COLOR = '166, 247, 208'; // Defaulting to your premium teal hex #a6f7d0

// --- Utility Hooks ---
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

// --- Spotlight Tracker ---
const GlobalSpotlight = ({ gridRef, disableAnimations, spotlightRadius = 300, glowColor }: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations: boolean;
  spotlightRadius?: number;
  glowColor: string;
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed; width: 800px; height: 800px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, rgba(${glowColor}, 0.05) 25%, transparent 70%);
      z-index: 50; opacity: 0; transform: translate(-50%, -50%);
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const section = gridRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !section) return;
      const rect = section.getBoundingClientRect();
      const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = section.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
        cards.forEach((card: any) => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1 });
      gsap.to(spotlightRef.current, { opacity: 0.6, duration: 0.2 });

      cards.forEach((card: any) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const intensity = Math.max(0, 1 - distance / spotlightRadius);
        
        card.style.setProperty('--glow-x', `${((e.clientX - cardRect.left) / cardRect.width) * 100}%`);
        card.style.setProperty('--glow-y', `${((e.clientY - cardRect.top) / cardRect.height) * 100}%`);
        card.style.setProperty('--glow-intensity', intensity.toString());
      });
    };

    const handleMouseLeave = () => {
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
      section.querySelectorAll('.magic-bento-card').forEach((card: any) => card.style.setProperty('--glow-intensity', '0'));
    };

    document.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, spotlightRadius, glowColor]);

  return null;
};

// --- Exports ---

export const MagicContainer = ({ children, className = '', glowColor = DEFAULT_GLOW_COLOR, spotlightRadius = 400 }: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  spotlightRadius?: number;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();

  return (
    <div ref={gridRef} className={`bento-section ${className}`}>
      {!isMobile && <GlobalSpotlight gridRef={gridRef} disableAnimations={isMobile} glowColor={glowColor} spotlightRadius={spotlightRadius} />}
      {children}
    </div>
  );
};

export const MagicCard = ({ 
  children, className = '', glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true, enableMagnetism = true, clickEffect = true, particles = false 
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particles?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();

  useEffect(() => {
    if (isMobile || !cardRef.current) return;
    const el = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, { rotateX: ((y - centerY) / centerY) * -5, rotateY: ((x - centerX) / centerX) * 5, duration: 0.2, ease: 'power2.out', transformPerspective: 1000 });
      }
      if (enableMagnetism) {
        gsap.to(el, { x: (x - centerX) * 0.05, y: (y - centerY) * 0.05, duration: 0.2, ease: 'power2.out' });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute; width: 400px; height: 400px; border-radius: 50%; pointer-events: none; z-index: 100;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 70%);
        left: ${e.clientX - rect.left - 200}px; top: ${e.clientY - rect.top - 200}px;
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, onComplete: () => ripple.remove() });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('click', handleClick);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleClick);
    };
  }, [isMobile, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div 
      ref={cardRef} 
      className={`magic-bento-card magic-bento-card--border-glow ${particles ? 'particle-container' : ''} ${className}`}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      {children}
    </div>
  );
};