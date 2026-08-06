'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DotField = dynamic(() => import('./DotField'), { ssr: false });

export default function ReviewsBackground() {
  return (
    <div className="absolute top-[620px] bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden opacity-50">
      <DotField
        dotRadius={1.8}
        dotSpacing={22}
        staticMode={true}
        gradientFrom="rgba(0, 88, 188, 0.28)"
        gradientTo="rgba(0, 220, 230, 0.20)"
      />
    </div>
  );
}
