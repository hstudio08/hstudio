import type { Metadata, Viewport } from "next";
import "./globals.css";

// Viewport configuration for mobile optimization and theme colors
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "H Studios | Premium Web Development Agency in Kashmir",
    template: "%s | H Studios"
  },
  description: "H Studios is a top-tier web development agency based in Srinagar. We turn ideas into high-performance, fast, and modern websites that build your brand and scale your business.",
  keywords: [
    "Web Development Srinagar", 
    "Website Design Kashmir", 
    "Next.js Agency", 
    "H Studios", 
    "SEO Optimization", 
    "Ecommerce Development", 
    "Fintech Websites",
    "Haadi Sabzar Lone"
  ],
  authors: [{ name: "Haadi Sabzar Lone" }],
  creator: "Haadi Sabzar Lone",
  publisher: "H Studios",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hstudios.vercel.app", // TODO: Replace with your actual live domain
    siteName: "H Studios",
    title: "H Studios | Premium Web Development Agency",
    description: "High-performance websites that scale your digital footprint. Based in Srinagar, serving brands globally.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "H Studios Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "H Studios | Web Development Agency",
    description: "We turn ideas into high-performance websites that build your brand.",
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
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Core bulk font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Optimized Accent fonts (Satisfy & Familjen Grotesk) */}
        <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Satisfy&display=swap" rel="stylesheet" />
        {/* Banner Fonts (Foldit & Story Script) */}
        <link href="https://fonts.googleapis.com/css2?family=Foldit:wght@100..900&family=Story+Script&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}