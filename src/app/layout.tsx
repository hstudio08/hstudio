import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

// Dynamically import heavy canvas effects so they don't block the main thread or initial render
const ClickSpark = dynamic(() => import("../../effects/ClickSpark"), { ssr: false });
const FireSparks = dynamic(() => import("../../effects/FireSparks"), { ssr: false });

// Viewport configuration for mobile optimization and theme colors
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Comprehensive SEO Metadata for Qurevo Technologies
export const metadata: Metadata = {
  metadataBase: new URL("https://qurevo.in"), // FIX: Added metadataBase to resolve Next.js warning
  title: {
    default: "Qurevo Technologies | Best Web Development Company in Srinagar & Kashmir",
    template: "%s | Qurevo Technologies"
  },
  description: "Qurevo Technologies (formerly H Studios) is the premier web development company based in Srinagar, Kashmir. We turn ideas into high-performance, fast, and modern websites that build your brand and scale your business.",
  
  // ADDED: Universal Favicon & PWA Manifest Configuration
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
  },
  manifest: '/site.webmanifest',

  keywords: [
    "Qurevo",
    "Qurevo Technologies",
    "Best Web Development Company in Srinagar", 
    "Best Web Development Company in Kashmir",
    "Website Design Kashmir", 
    "Next.js Agency", 
    "SEO Optimization", 
    "Ecommerce Development", 
    "Fintech Websites",
    "Haadi Sabzar Lone",
    "hstudios" // Kept for legacy search traffic transition
  ],
  authors: [{ name: "Haadi Sabzar Lone" }],
  creator: "Haadi Sabzar Lone",
  publisher: "Qurevo Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://qurevo.in", 
    siteName: "Qurevo Technologies",
    title: "Qurevo Technologies | Premium Web Development Agency",
    description: "High-performance websites that scale your digital footprint. Based in Srinagar, serving brands globally.",
    images: [
      {
        url: "https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp", 
        width: 800,
        height: 800,
        alt: "Qurevo Technologies Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qurevo Technologies | Web Development Agency",
    description: "We turn ideas into high-performance websites that build your brand. Top web development in Srinagar & Kashmir.",
    images: ["https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Caveat:wght@400;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Satisfy&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Foldit:wght@100..900&family=Story+Script&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" rel="stylesheet" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col min-h-screen relative overflow-x-hidden">
        
        {/* Global Click Spark Overlay */}
        <ClickSpark 
          sparkColors={['#10B981', '#3B82F6', '#F97316']}
          sparkCount={10} 
          sparkRadius={25} 
        />
        
        {/* Global Fire Sparks Background */}
        <FireSparks/>
        
        {children}
        
      </body>
    </html>
  );
}