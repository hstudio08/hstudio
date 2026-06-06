"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// --- Utility Components for Animations --- //

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      {children}
    </div>
  );
};

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref} className="font-['Familjen_Grotesk'] tracking-tight">{count}{suffix}</span>;
};

// --- Main Component --- //

export default function Projects() {
  const [sectionInView, setSectionInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setSectionInView(entry.isIntersecting);
    }, { threshold: 0.05 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
      text: "A top-tier educational consulting website in Srinagar, designed for maximum student engagement and trust.", 
      image: "https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780641541/pexels-sora-shimazaki-5668858_1200x768_jociel.avif",
      link: "https://kicc.co.in"
    },
    { 
      title: "The Vintage House", 
      tag: "Hotel & Restaurant", 
      text: "A shining digital presence for Kupwara's most loved hotel, showcasing their exquisite hospitality and vintage charm.", 
      image: "https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780641602/get-together_e0vjzh.jpg",
      link: "https://vintagehousekupwara.com"
    }
  ];

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className={`py-12 md:py-20 overflow-hidden transition-colors duration-1000 ease-in-out ${sectionInView ? 'bg-slate-50/80' : 'bg-white'}`}
    >
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Component Header Block */}
        <ScrollReveal>
          <div className="text-center flex flex-col items-center space-y-2 md:space-y-3 mb-10 md:mb-16">
            <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full font-['Familjen_Grotesk'] shadow-sm">
              Our Work
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 font-['Foldit'] tracking-wide drop-shadow-sm px-2">
              Real Projects. Real Results.
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-slate-500 font-['Story_Script'] max-w-sm md:max-w-none">
              A glimpse of websites we&apos;ve built for amazing brands in Kashmir.
            </p>
          </div>
        </ScrollReveal>

        {/* Portfolio Dynamic Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {showcase.map((project, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group relative flex flex-col bg-white border border-slate-100 rounded-3xl md:rounded-[2rem] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_rgba(224,166,247,0.15)] hover:-translate-y-2 md:hover:-translate-y-3 hover:border-[#bff0f5]/80 h-full z-10">
                
                {/* Soft Animated Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#bff0f5]/10 via-transparent to-[#e0a6f7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                {/* Media Container Box */}
                <div className="h-48 sm:h-56 md:h-64 relative flex flex-col justify-between overflow-hidden p-5 md:p-6 z-10">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transform transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-slate-900/40 transition-colors duration-700 group-hover:bg-gradient-to-t group-hover:from-slate-900/80 group-hover:via-slate-900/20 group-hover:to-[#a6f7d0]/10 mix-blend-multiply" />
                  
                  <span className="relative bg-white/90 backdrop-blur-md text-[10px] md:text-[11px] uppercase tracking-wider font-bold text-slate-900 px-3 py-1 md:px-4 md:py-1.5 rounded-full self-start shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-10 transition-transform duration-500 group-hover:-translate-y-1 font-['Familjen_Grotesk']">
                    {project.tag}
                  </span>
                </div>

                {/* Text Description Box */}
                <div className="p-5 md:p-8 flex flex-col flex-grow justify-between space-y-4 md:space-y-5 bg-transparent relative z-10 transition-colors duration-700">
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-950 transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-[#e0a6f7]">
                      {project.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 mt-2 md:mt-2.5 leading-relaxed font-medium transition-colors duration-500 group-hover:text-slate-700">
                      {project.text}
                    </p>
                  </div>
                  
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs font-bold text-blue-600 flex items-center space-x-1.5 mt-auto pt-3 md:pt-4 transition-all duration-300 group-hover:text-[#e0a6f7]">
                    <span className="uppercase tracking-widest">Visit Website</span>
                    <span className="transform transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-0.5 text-base md:text-lg">↗</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Client Love & Testimonials */}
        <ScrollReveal delay={150}>
          <div id="services" className="mt-16 md:mt-32 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
            
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#bff0f5]/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-[#e0a6f7]/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

            <div className="text-center flex flex-col items-center space-y-2 mb-10 md:mb-16 relative z-10">
              <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full font-['Familjen_Grotesk'] shadow-sm">
                Client Love
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 mt-2 md:mt-4 tracking-tight">
                They Trust <span className="text-gradient font-['Satisfy'] font-normal px-1 md:px-2 tracking-normal text-3xl sm:text-4xl md:text-6xl drop-shadow-sm">H &bull; Studios</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-stretch relative z-10">
              
              {/* Founder's Note (Left Column) - Scaled for Mobile */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl md:shadow-2xl relative overflow-hidden flex flex-col justify-center transition-transform duration-700 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[#a7fcfb]/15 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-[#e0a6f7]/15 rounded-full blur-2xl md:blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#a7fcfb] mb-4 md:mb-6 font-['Familjen_Grotesk']">
                    Founder&apos;s Note
                  </h4>
                  <p className="text-lg md:text-2xl text-[#bff0f5]/90 leading-relaxed md:leading-relaxed mb-6 md:mb-10 font-['Story_Script']">
                    &ldquo;At <strong className="text-white font-['Satisfy'] text-xl md:text-3xl mx-1 font-normal tracking-wide">H &bull; Studios</strong>, we don&apos;t just build websites; we craft digital experiences that capture the soul of your brand. Seeing our clients thrive online is what drives our relentless pursuit of perfection.&rdquo;
                  </p>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#a6f7d0] to-[#e0a6f7] p-[2px] shadow-lg flex-shrink-0">
                      <div className="w-full h-full bg-slate-800 rounded-full overflow-hidden relative flex items-center justify-center">
                        <Image src="/logo.png" alt="Founder" width={24} height={24} className="object-contain w-5 md:w-6 h-auto" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-black text-white tracking-tight">Haadi Sabzar Lone</p>
                      <p className="text-[10px] md:text-xs text-[#bff0f5]/70 font-bold uppercase tracking-wider mt-0.5 font-['Familjen_Grotesk']">Founder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews (Right Column) - Scaled for Mobile */}
              <div className="lg:col-span-7 space-y-4 md:space-y-6 flex flex-col justify-center">
                {[
                  { 
                    name: "Waqar Abdullah", 
                    role: "Founder, The Career Advisors-Srinagar", 
                    img: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779560322/waqarportrait_ktr3dd.png",
                    quote: "H • Studios didn't just satisfy us; we absolutely loved their work. The website perfectly captures our vision and has elevated our brand to new heights." 
                  },
                  { 
                    name: "Danish Shafi", 
                    role: "Founder, KICC Consultancy-Srinagar", 
                    img: "https://kicc.co.in/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdwwzpcnkx%2Fimage%2Fupload%2Fq_auto%2Ff_auto%2Fv1779777535%2Ffounder_kxowrh.jpg&w=3840&q=75",
                    quote: "Our online presence is now as shining as our brand. They delivered a platform that truly reflects the exquisite service we are known for." 
                  }
                ].map((client, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(191,240,245,0.3)] transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#bff0f5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="flex items-center space-x-3 md:space-x-5 mb-3 md:mb-5 relative z-10">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white relative shadow-sm md:shadow-md group-hover:border-[#a6f7d0] transition-colors duration-500 flex-shrink-0">
                        <Image src={client.img} alt={client.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm md:text-base font-black text-slate-900 tracking-tight">{client.name}</h4>
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wide mt-0.5 md:mt-1 font-['Familjen_Grotesk'] line-clamp-1">{client.role}</p>
                      </div>
                      <div className="text-yellow-400 text-xs md:text-sm hidden sm:flex tracking-widest drop-shadow-sm">★★★★★</div>
                    </div>
                    <p className="text-sm md:text-[15px] text-slate-600 italic leading-relaxed relative z-10 font-medium group-hover:text-slate-800 transition-colors duration-300">
                      &ldquo;{client.quote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* Core Analytics Metrics Ledger Row with Counters - Scaled for Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-10 md:mt-16 pt-8 md:pt-12 border-t border-slate-100 text-center relative z-10">
              {[
                { val: 25, label: "Happy Clients", suffix: "+" },
                { val: 30, label: "Projects Done", suffix: "+" },
                { val: 100, label: "Satisfaction", suffix: "%" },
                { val: 2, label: "Years Experience", suffix: "+" }
              ].map((metric, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100/50 shadow-sm transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(224,166,247,0.2)] hover:bg-white group cursor-default">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 group-hover:from-[#e0a6f7] group-hover:to-blue-600 transition-all duration-500 drop-shadow-sm">
                    <AnimatedCounter end={metric.val} suffix={metric.suffix} />
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 md:mt-3 font-['Familjen_Grotesk'] group-hover:text-slate-800 transition-colors duration-500">{metric.label}</span>
                </div>
              ))}
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}