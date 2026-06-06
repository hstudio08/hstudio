"use client";

import React, { useEffect, useRef } from "react";

interface FireSparksProps {
  sparkCount?: number;
  colors?: string[];
}

export default function FireSparks({ 
  // Reduced to 25 for a subtle, less intrusive ambient effect
  sparkCount = 25, 
  // Added a lighter, hotter ember color (#ffcf70) to the mix
  colors = ["#ff7a00", "#ffaa00", "#ff4400", "#ffcf70"] 
}: FireSparksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Spark[] = [];

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener("resize", resize);
    resize();

    class Spark {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      baseOpacity: number;
      color: string;
      sway: number;
      swaySpeed: number;

      constructor() {
        // FIXED: Spread sparks randomly across the ENTIRE screen height on initial load
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        
        // Smaller, more realistic ember sizes (0.5px to 2px)
        this.size = Math.random() * 1.5 + 0.5;
        
        // Slower, varying vertical floating speeds
        this.speedY = Math.random() * -1 - 0.2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.opacity = this.baseOpacity;
        
        // Parameters for erratic wind movement and flickering
        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.05 + 0.01;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        
        // Add a sine wave to the X axis for erratic wind floating
        this.x += this.speedX + Math.sin(this.sway) * 0.3;
        this.sway += this.swaySpeed;

        // Flicker effect: Modulate opacity using the sway value
        this.opacity = this.baseOpacity + Math.sin(this.sway * 2) * 0.2;

        // Reset particle if it goes off the top or edges
        if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * window.innerWidth;
        // When resetting, spawn slightly below the screen to float up naturally
        this.y = window.innerHeight + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * -1 - 0.2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        ctx.fillStyle = this.color;
        // Ensure opacity stays within 0-1 bounds during flicker
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        
        ctx.shadowBlur = this.size * 3; // Glow radius relative to spark size
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.globalAlpha = 1.0; 
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < sparkCount; i++) {
      particles.push(new Spark());
    }

    const animate = () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sparkCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      aria-hidden="true"
    />
  );
}