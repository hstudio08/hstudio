"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // 1. Import Next.js Image component

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="fixed w-full z-50 top-0 transition-all duration-300 glass-card rounded-none border-b border-slate-100/50 py-4 px-6 md:px-12 flex justify-between items-center"
    >
      {/* 2. Replace the text logo with your image */}
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/logo.png" /* Use /logo.png if you renamed it */
          alt="H Studios Logo" 
          width={50} 
          height={50} 
          className="w-12 h-auto"
        />
        <span className="font-bold text-2xl tracking-tighter text-slate-900 hidden sm:block">
          Studios
        </span>
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        <Link href="#work" className="hover:text-brand-500 transition-colors">Work</Link>
        <Link href="#pricing" className="hover:text-brand-500 transition-colors">Pricing</Link>
        <Link href="#contact" className="hover:text-brand-500 transition-colors">Contact</Link>
      </div>
      <Link href="#contact" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-glow">
        Book a Project
      </Link>
    </motion.nav>
  );
}