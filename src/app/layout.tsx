import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "H Studios | Web Development Agency",
  description: "We Build Websites That Build Your Brand. Founded by Haadi Sabzar Lone.",
  openGraph: {
    title: "H Studios | Premium Web Development",
    description: "High-performance, modern websites designed to scale your business.",
    url: "https://hstudios.agency",
    siteName: "H Studios",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}