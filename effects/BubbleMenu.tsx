"use client";

import React, { useState, useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

export interface BubbleMenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
}

interface BubbleMenuProps {
  logo?: ReactNode;
  onMenuClick?: (open: boolean) => void;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  actionButton?: ReactNode;
}

export default function BubbleMenu({
  logo,
  onMenuClick,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#b2fab9',
  menuContentColor = '#0f172a',
  items = [],
  animationEase = 'back.out(1.2)', 
  animationDuration = 0.4,
  staggerDelay = 0.08, 
  actionButton
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // We use a single container ref to scope our GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    if (!containerRef.current || !showOverlay) return;

    const ctx = gsap.context(() => {
      // Find elements directly from the DOM, avoiding React array sync bugs
      const overlay = containerRef.current?.querySelector('.bubble-menu-items');
      const bubbles = gsap.utils.toArray('.pill-link');
      const labels = gsap.utils.toArray('.pill-label');

      if (!overlay) return;

      if (isMenuOpen) {
        gsap.set(overlay, { pointerEvents: 'auto' });
        gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        
        gsap.killTweensOf([...bubbles, ...labels]);
        
        // Read the rotation directly from the data-attribute
        gsap.set(bubbles, { 
          scale: 0, 
          rotation: (i, target: any) => Number(target.dataset.rotation) || 0, 
          transformOrigin: '50% 50%' 
        });
        gsap.set(labels, { y: 15, autoAlpha: 0 });

        bubbles.forEach((bubble: any, i) => {
          const delay = i * staggerDelay;
          const tl = gsap.timeline({ delay });

          tl.to(bubble, {
            scale: 1,
            duration: animationDuration,
            ease: animationEase
          });
          
          if (labels[i]) {
            tl.to(labels[i] as Element, {
                y: 0,
                autoAlpha: 1,
                duration: animationDuration * 0.8,
                ease: 'power3.out'
              }, `-=${animationDuration * 0.6}`
            );
          }
        });
      } else {
        gsap.set(overlay, { pointerEvents: 'none' });
        gsap.killTweensOf([...bubbles, ...labels]);
        
        gsap.to(labels, { y: 10, autoAlpha: 0, duration: 0.2, ease: 'power2.in' });
        gsap.to(bubbles, { scale: 0, duration: 0.25, ease: 'power2.in', stagger: 0.03 });
        
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          delay: 0.1,
          onComplete: () => setShowOverlay(false)
        });
      }
    }, containerRef);

    return () => ctx.revert(); 
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  const backgroundElementsStyle = `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    isMenuOpen ? 'opacity-30 blur-[4px] scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'
  }`;

  return (
    <div ref={containerRef}>
      <nav className="bubble-menu" aria-label="Main navigation">
        <div 
          className={`bubble logo-bubble ${backgroundElementsStyle}`} 
          aria-label="Logo" 
          style={{ background: menuBg }}
        >
          <span className="logo-content">{logo}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {actionButton && (
            <div className={`flex items-center ${backgroundElementsStyle}`}>
              {actionButton}
            </div>
          )}
          
          <button
            type="button"
            className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={handleToggle}
            aria-label={menuAriaLabel}
            style={{ background: menuBg }}
          >
            <span className="menu-line" style={{ background: menuContentColor }} />
            <span className="menu-line" style={{ background: menuContentColor }} />
          </button>
        </div>
      </nav>

      {showOverlay && (
        <div className="bubble-menu-items" aria-hidden={!isMenuOpen}>
          <ul className="pill-list" role="menu">
            {items.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  className="pill-link"
                  data-rotation={item.rotation || 0} // Injected safely for GSAP
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    '--pill-bg': menuBg,
                    '--pill-color': menuContentColor,
                  } as CSSProperties}
                >
                  <span className="pill-label">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}