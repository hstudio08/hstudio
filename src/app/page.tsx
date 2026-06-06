import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Projects from "../../components/Projects";
import Pricing from "../../components/Pricing";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";
import AboutUs from "../../components/AboutUs";
import Reviews from "../../components/Reviews";

// STRICT CACHING: Forces Next.js to serve this from CDN cache permanently until rebuilt
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Qurevo Technologies",
    "image": "https://qurevotechnologies.vercel.app/logo.png", 
    "@id": "https://qurevotechnologies.vercel.app", 
    "url": "https://qurevotechnologies.vercel.app", 
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
    "description": "Qurevo Technologies is a premium web development agency turning ideas into high-performance, fast, and modern websites."
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
        <Reviews />
        <Contact />
        <Footer />
      </main>
    </>
  );
}