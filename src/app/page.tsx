import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Projects from "../../components/Projects";
import Pricing from "../../components/Pricing";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";

// STRICT CACHING: Forces Next.js to serve this from CDN cache permanently until rebuilt
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "H Studios",
    "image": "https://hstudios.vercel.app/logo.png", 
    "@id": "https://hstudios.vercel.app", 
    "url": "https://hstudios.vercel.app", 
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Srinagar",
      "addressRegion": "Jammu and Kashmir",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.0837,
      "longitude": 74.7973
    },
    "priceRange": "$$$",
    "founder": {
      "@type": "Person",
      "name": "Haadi Sabzar Lone"
    },
    "description": "H Studios is a premium web development agency turning ideas into high-performance, fast, and modern websites."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex flex-col w-full overflow-hidden">
        <Navbar />
        <Hero />
        <Projects />
        <Pricing />
        <Contact />
        <Footer />
      </main>
    </>
  );
}