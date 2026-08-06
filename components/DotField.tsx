'use client';

import React, { useEffect, useRef, memo } from 'react';
import './DotField.css';

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  staticMode?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

const DotField: React.FC<DotFieldProps> = memo(({
  dotRadius = 1.5,
  dotSpacing = 22,
  staticMode = true,
  gradientFrom = 'rgba(0, 88, 188, 0.28)',
  gradientTo = 'rgba(0, 220, 230, 0.20)',
  className = '',
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let resizeTimer: NodeJS.Timeout;

    function renderStaticGrid() {
      if (!canvas || !canvas.parentElement || !ctx) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, gradientFrom);
      grad.addColorStop(1, gradientTo);
      ctx.fillStyle = grad;

      const step = dotRadius + dotSpacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      const rad = dotRadius / 2;
      const TWO_PI = Math.PI * 2;

      ctx.beginPath();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          ctx.moveTo(ax + rad, ay);
          ctx.arc(ax, ay, rad, 0, TWO_PI);
        }
      }
      ctx.fill();
    }

    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderStaticGrid, 100);
    }

    renderStaticGrid();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [dotRadius, dotSpacing, gradientFrom, gradientTo]);

  return (
    <div className={`dot-field-container ${className}`.trim()} {...rest}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
});

DotField.displayName = 'DotField';

export default DotField;
