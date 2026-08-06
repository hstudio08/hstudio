import { Metadata } from "next";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "About Qurevo Technologies | Best Web Development Company in Srinagar",
  description: "Qurevo Technologies is the top web development company in Srinagar. We are a premier website design agency in Kashmir offering modern, SEO-friendly digital solutions.",
};

export default function AboutPage() {
  const showcase = [
    { 
      title: "The Career Advisors", 
      tag: "Education Consultancy", 
      text: "A premium educational consultancy platform in Srinagar, delivering seamless student guidance and enrollment services.", 
      image: "https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780641297/pexels-pixabay-267885_pc88j4.jpg",
      link: "https://thecareeradvisors.in"
    },
    { 
      title: "KICC", 
      tag: "Education Consultancy", 
      text: "A top-tier educational consultation agency in Srinagar, designed for maximum student engagement and trust.", 
      image: "https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780641541/pexels-sora-shimazaki-5668858_1200x768_jociel.avif",
      link: "https://kicc.co.in"
    },
    { 
      title: "The Vintage House", 
      tag: "Hotel & Restaurant", 
      text: "A shining digital presence for Kupwara's most loved hotel, showcasing their exquisite hospitality and vintage charm.", 
      image: "https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780714607/photo_6_2026-06-04_17-54-19_p4bdcc_oywtg6.webp",
      link: "https://vintagehousekupwara.com"
    },
    { 
      title: "Rahil Yousuf", 
      tag: "Author Portfolio", 
      text: "A serene digital platform for an author to publish and present poetic works, quotes, and creative writings.", 
      image: "https://res.cloudinary.com/dpqsadqxj/image/upload/v1785995861/c6b67382-3415-4814-8d86-bb4512ccaf0d.png",
      link: "https://rahilyousuf.vercel.app"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />

      {/* Hero Section - Split Layout with Logo on Right */}
      <section className="relative pt-32 pb-10 md:pt-36 md:pb-12 px-4 sm:px-6 md:px-8 max-w-[96rem] mx-auto w-full z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
              About <span className="font-['Satisfy'] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 px-2 font-normal">Qurevo</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-extrabold text-blue-700 mb-6">
              The Top Web Development Company in Srinagar
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full mb-8"></div>
            
            <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed mb-4">
              If you are looking for the <strong className="text-blue-700">best web development company in Srinagar</strong>, Qurevo Technologies is your ultimate digital partner. We are a modern <strong className="text-blue-700">website design agency in Kashmir</strong> focused on building high-performance websites, scalable digital platforms, and result-driven online experiences for businesses and startups.
            </p>
            <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed mb-4">
              Founded in 2024 as H Studios by <strong className="text-blue-700">Haadi Sabzar Lone</strong>—widely regarded as the <strong className="text-blue-700">best web developer in Kashmir</strong>—Qurevo Technologies evolved into a full-scale digital agency. Our mission is to make world-class web development accessible across Jammu & Kashmir.
            </p>
          </div>

          {/* Full Logo on Top Right */}
          <div className="hidden lg:block shrink-0 pt-20 opacity-100 drop-shadow-sm">
            <Image 
              src="/icons/fulllogo.png" 
              alt="Qurevo Technologies Full Logo" 
              width={420} 
              height={240} 
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid - Reduced Gaps, Left Aligned */}
      <section className="px-4 sm:px-6 md:px-8 max-w-[96rem] mx-auto w-full pb-16 z-10 space-y-12">
        
        {/* Mission & What Makes Us Different */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Mission Card */}
          <div className="bg-white border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Our Mission in Kashmir</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our mission is to empower local businesses by building digital systems that are fast, scalable, and optimized for search engines. We aim to bridge the gap between local businesses and global digital standards.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a <strong className="text-slate-800">modern web developer in Srinagar</strong>, <strong className="text-blue-600">Haadi Sabzar</strong> ensures that every project we touch generates real results—traffic, leads, and maximum conversions.
            </p>
          </div>

          {/* Differentiator Card (Heavy Brand Colors) */}
          <div className="bg-gradient-to-br from-blue-900 to-sky-900 p-6 md:p-8 rounded-2xl shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-400/20 blur-3xl rounded-full pointer-events-none"></div>
            <h3 className="text-2xl font-extrabold text-white mb-4 relative z-10">Why We Are The Best in Srinagar</h3>
            <p className="text-sky-100 leading-relaxed mb-6 relative z-10 text-sm md:text-base">
              Unlike traditional agencies, Qurevo operates with a lean, modern, and performance-driven approach. We don’t just build websites — we build digital growth systems. What sets us apart:
            </p>
            <ul className="space-y-3 relative z-10 text-sm md:text-base">
              {[
                "Focus on SEO-optimized web development in Srinagar",
                "Clean, modern, and conversion-focused UI/UX design",
                "Fast-loading, performance-first architecture",
                "Mobile-first responsive development",
                "Scalable systems for long-term business growth"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sky-50">
                  <svg className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Services - Tighter Grid */}
        <div>
          <div className="mb-8 border-b border-slate-200 pb-4">
            <h3 className="text-3xl font-extrabold text-slate-900">Our Premium Web Services</h3>
            <p className="text-slate-600 mt-2">Complete digital solutions from the <strong className="text-blue-700">best web developer in Srinagar</strong>.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            
            {/* Business */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-sky-300 transition-colors group">
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Business Websites</h4>
              <p className="text-slate-600 text-sm mb-4">Professional websites for local businesses in Kashmir, service providers, and agencies looking to build trust and generate leads.</p>
            </div>

            {/* E-Commerce */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-sky-300 transition-colors group">
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">E-Commerce Platforms</h4>
              <p className="text-slate-600 text-sm mb-4">Need an <strong className="text-blue-600">ecommerce developer in Srinagar</strong>? We build highly scalable, mobile-optimized online stores with secure checkout systems.</p>
            </div>

            {/* Portfolio */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-sky-300 transition-colors group">
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Portfolios & Creators</h4>
              <p className="text-slate-600 text-sm mb-4">Modern portfolio designs for developers, designers, and freelancers to showcase their work and establish a premium personal brand.</p>
            </div>

          </div>
        </div>

        {/* SEO & Packages Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* SEO Focus */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">SEO Optimization in Kashmir</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              A beautiful website is useless if no one can find it. Developed by an experienced <strong className="text-blue-700">seo expert in Kashmir</strong>, every platform we build follows a strict SEO-first approach to ensure dominant visibility on Google.
            </p>
            <ul className="space-y-3">
              {[
                "Clean code structure optimized for search engines",
                "Sub-second loading speed optimization",
                "Mobile-first interface design",
                "Local SEO targeting for Srinagar & Kashmir"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-700 font-medium text-sm">
                  <svg className="w-5 h-5 text-emerald-500 mt-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Packages */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-extrabold text-white mb-2">Our Growth Packages</h3>
            <p className="text-slate-400 mb-6 text-sm">Flexible and scalable website packages designed for local businesses.</p>
            
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white">Starter Package</h4>
                <p className="text-xs text-slate-300 mt-1">Basic business website, modern responsive design, contact integration, and basic SEO setup.</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white">Growth Package </h4>
                <p className="text-xs text-sky-100 mt-1">Multi-page professional site, advanced UI/UX, on-page SEO, speed optimization, and lead generation.</p>
              </div>
              <div className="bg-gradient-to-r from-sky-900 to-blue-900 p-4 rounded-xl border border-blue-700">
                <h4 className="font-bold text-white">Premium Package <span className="ml-2 text-[10px] bg-sky-400 text-sky-900 px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</span></h4>
                <p className="text-xs text-sky-100 mt-1">Custom web applications, e-commerce, high-performance architecture, and priority support.</p>
              </div>
            </div>
          </div>
        </div>

{/* NEW SECTION: Founder Biography Section */}
        <div className="relative overflow-hidden bg-white border border-sky-100 p-6 md:p-10 rounded-3xl mt-8 shadow-sm">
          {/* Soft blue radial background effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-sky-100/60 via-white to-white pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            {/* Founder Image */}
            <div className="shrink-0 mx-auto md:mx-0 relative">
              {/* Soft glow behind the image */}
              <div className="absolute inset-0 bg-blue-300/30 blur-2xl rounded-full scale-110 -z-10"></div>
              <Image
                src="/haadi-sabzar-founder-qurevotechnologies.png"
                alt="Haadi Sabzar Lone - Founder of Qurevo Technologies"
                width={180}
                height={180}
                className="rounded-4xl shadow-lg border-4 border-white object-cover"
              />
            </div>
            
            {/* Founder Text */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">Meet the Founder</h3>
              <h4 className="text-lg font-bold text-blue-600 mb-4">Haadi Sabzar (Hadi Sabzar)</h4>
              
              <div className="text-slate-700 leading-relaxed text-sm md:text-base space-y-4">
                <p>
                  <strong>Haadi Sabzar</strong>, also known as Hadi Sabzar, is a young and passionate <strong className="text-slate-900">web developer from Bijbehara, Anantnag, Jammu & Kashmir</strong>. He is the Founder of Qurevo Technologies, a modern startup web agency built with a vision to help businesses grow online through high-quality, performance-driven digital solutions.
                </p>
                
                {/* Native HTML details/summary for SEO-friendly "Read More" */}
                <details className="group [&::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 transition-colors list-none select-none mt-1">
                    <span className="group-open:hidden flex items-center gap-1">Read Full Bio <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                    <span className="hidden group-open:flex items-center gap-1">Show Less <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg></span>
                  </summary>
                  
                  <div className="mt-5 space-y-4 pt-5 border-t border-sky-100">
                    <p>
                      Qurevo Technologies was originally started in 2024 as H Studios and later evolved into a full-fledged digital startup focused on delivering professional web development services. Under Haadi’s leadership, the agency specializes in building modern, fast, and scalable websites for businesses across Kashmir, including Srinagar, Anantnag, Kupwara, and Budgam, with a growing focus on wider markets.
                    </p>
                    <p>
                      With hands-on experience in 10+ major web development projects, Haadi has worked with a diverse range of clients including restaurants, startups, personal brands, hotels, e-commerce stores, portfolios, and education consultancies. His work focuses on combining clean UI/UX design with strong technical performance to create impactful digital experiences.
                    </p>
                    <p>
                      He is highly skilled in modern web technologies such as <strong>JavaScript, HTML, CSS, React, Next.js, Firebase, and Vercel</strong>, along with expertise in <strong className="text-slate-900">SEO, Google Search Console, and website optimization</strong>. His strengths lie in full-stack development, frontend engineering, SEO optimization, and building business-focused web applications that help improve visibility, user engagement, and conversions.
                    </p>
                    <p>
                      Through Qurevo Technologies, Haadi’s mission is to help small and growing businesses establish a strong online presence, while also building a long-term digital agency that delivers value-driven web solutions across Kashmir and beyond.
                    </p>
                    <div className="bg-sky-50/80 p-4 rounded-xl border border-sky-100 mt-4 backdrop-blur-sm">
                      <p className="text-sm font-medium text-slate-800">
                        Connect with Qurevo Technologies through the contact form on our website or reach out directly at <a href="mailto:Qurevotechnologies@gmail.com" className="font-bold text-blue-600 hover:underline">Qurevotechnologies@gmail.com</a> for project inquiries and collaborations.
                      </p>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Section */}
        <div className="bg-sky-50 border border-sky-100 p-6 md:p-10 rounded-3xl mt-8">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Partner with the Best Web Developer in Kashmir</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our vision is to shape Srinagar into a growing hub for modern technology and digital innovation. Qurevo exists to prove that businesses in Kashmir deserve—and can easily access—world-class digital solutions.
            </p>
            <p className="text-slate-700 font-medium">
              We are more than just an agency; we are your long-term digital partner. From simple websites to advanced digital systems, we build solutions that are fast, modern, and strictly results-driven.
            </p>
          </div>
        </div>

        {/* Video Editing Services */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl mt-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="max-w-3xl relative z-10">
            <h3 className="text-3xl font-extrabold mb-4">Professional Video Editing Services</h3>
            <p className="text-slate-300 leading-relaxed mb-4 text-lg">
              Beyond web development, Qurevo houses a team of specialized video editors dedicated to bringing your brand&apos;s visual story to life.
            </p>
            <p className="text-slate-400 font-medium">
              We leverage industry-leading, professional software like <strong className="text-sky-400">DaVinci Resolve</strong> and <strong className="text-sky-400">CapCut Pro</strong> to deliver cinematic color grading, dynamic cuts, and high-retention content tailored for social media, YouTube, and corporate showcases.
            </p>
          </div>
          <div className="relative z-10 hidden md:flex flex-col items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-600 p-5 rounded-2xl text-center shadow-inner">
              <span className="block text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">4K+</span>
              <span className="text-xs text-slate-300 uppercase tracking-widest mt-1 block">Cinematic Quality</span>
            </div>
          </div>
        </div>

        {/* Dynamic Showcase Section */}
        <div className="pt-12 md:pt-16 border-t border-slate-200">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block shadow-sm">
                100% Client Satisfaction
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900">Projects Delivered by Qurevo</h3>
              <p className="text-slate-600 mt-2 text-lg">Real results for incredible brands across Kashmir.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {showcase.map((project, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <Image 
                    src={project.image}
                    alt={`${project.title} Website by Qurevo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-300" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full w-max mb-3 uppercase tracking-wider">
                    {project.tag}
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {project.text}
                  </p>
                  
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-auto pt-4 border-t border-slate-100 text-sm font-bold text-blue-600 flex items-center gap-1.5 group-hover:text-sky-500 transition-colors w-max"
                  >
                    Visit Website
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}