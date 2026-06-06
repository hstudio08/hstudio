import type { Metadata, Viewport } from "next";
import ClickSpark from "../../effects/ClickSpark";
import FireSparks from "../../effects/FireSparks"; 
import "./globals.css";

// Viewport configuration for mobile optimization and theme colors
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Comprehensive SEO Metadata for Qurevo Technologies
export const metadata: Metadata = {
  metadataBase: new URL("https://qurevo.vercel.app"), // FIX: Added metadataBase to resolve Next.js warning
  title: {
    default: "Qurevo Technologies | Best Web Development Company in Srinagar & Kashmir",
    template: "%s | Qurevo Technologies"
  },
  description: "Qurevo Technologies (formerly H Studios) is the premier web development company based in Srinagar, Kashmir. We turn ideas into high-performance, fast, and modern websites that build your brand and scale your business.",
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
    url: "https://qurevo.vercel.app", 
    siteName: "Qurevo Technologies",
    title: "Qurevo Technologies | Premium Web Development Agency",
    description: "High-performance websites that scale your digital footprint. Based in Srinagar, serving brands globally.",
    images: [
      {
        url: "/logo.png", 
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
    images: ["/logo.png"],
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Satisfy&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Foldit:wght@100..900&family=Story+Script&display=swap" rel="stylesheet" />
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