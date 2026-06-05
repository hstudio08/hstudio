import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Projects from "../../components/Projects";
import Pricing from "../../components/Pricing";
import Contact from "../../components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-brand-200 selection:text-brand-900">
      <Navbar />
      <Hero />
      <Projects />
      <Pricing />
      <Contact />
    </main>
  );
}