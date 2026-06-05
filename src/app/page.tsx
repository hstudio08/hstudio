import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Projects from "../../components/Projects";
import Pricing from "../../components/Pricing";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";

export default function Home() {
  
  // JSON-LD Structured Data for Local SEO & Agency Authority
  // Ensure you update the "url" and "image" fields once your site is live
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "H Studios",
    "image": "https://yourwebsite.com/logo.png", 
    "@id": "https://yourwebsite.com", 
    "url": "https://yourwebsite.com", 
    "telephone": "", // Add your public business phone number here if you have one
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
      {/* Inject Structured Data for Search Engines */}
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