import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import ReviewsBackground from '../../../../components/ReviewsBackground';
import FoldText from '../../../../components/FoldText';
import TextLoop from '../../../../components/TextLoop';
import BorderGlow from '../../../../components/BorderGlow';

export const metadata: Metadata = {
  title: 'Client Reviews & Independent Testimonials | Qurevo Technologies',
  description: 'Read 15 verified organic client reviews, testimonials, and independent feedback for Qurevo Technologies — Kashmir\'s premier web development agency.',
  keywords: [
    'Qurevo Technologies Reviews',
    'Qurevo Client Feedback',
    'Best Web Development Company Kashmir Reviews',
    'Qurevo Testimonials',
    'Haadi Sabzar Qurevo Reviews',
    'Musaib Manzoor Qurevo Review',
    'Organic Client Reviews Kashmir',
    'Web Development Agency Srinagar Feedback'
  ],
  alternates: {
    canonical: 'https://qurevo.in/reviews/client-testimonials',
  },
  openGraph: {
    title: 'Client Reviews & Independent Testimonials | Qurevo Technologies',
    description: 'Read 15 verified organic client reviews and independent feedback for Qurevo Technologies.',
    url: 'https://qurevo.in/reviews/client-testimonials',
    siteName: 'Qurevo Technologies',
    locale: 'en_US',
    type: 'website',
  },
};

const clientReviews = [
  {
    id: 15,
    name: 'Musaib Manzoor',
    email: 'Founder of MyExpert',
    review: 'Working with this web development company was a great experience from start to finish. They understood exactly what I wanted and turned my ideas into a modern, fast, and professional website. The team was responsive, easy to communicate with, and delivered everything on time. The website looks amazing on both mobile and desktop, loads quickly, and feels very polished. They also paid attention to the small details that make a big difference in user experience. If you\'re looking for a reliable web development company that delivers high-quality work and excellent support, I would definitely recommend them.',
    rating: 5,
    date: '2026-08-06',
    tag: 'Founder of MyExpert & Strategic Collaborator',
    initial: 'M',
    isFeatured: true
  },
  {
    id: 1,
    name: 'Wani Murtaza',
    email: null,
    review: 'Truly nice behaivior, and got 50% off on my website due to their collaboration offer.',
    rating: 5,
    date: '2026-06-15',
    tag: 'Verified Client #1',
    initial: 'W'
  },
  {
    id: 2,
    name: 'Sheikh Rahil Yousuf',
    email: null,
    review: 'I think it\'s lovelier than the love of jove I am profoundly exhilarated to have discovered this exquisite platform. It has bestowed upon my mind a rare tranquility and transformed my writings into enduring keepsakes, preserving both my thoughts and my voice against the erosion of time.',
    rating: 5,
    date: '2026-06-20',
    tag: 'Author Portfolio Client',
    initial: 'S'
  },
  {
    id: 3,
    name: 'Hinan',
    email: null,
    review: 'I must say, Qurevo Technologies is one of the top, modern web solution providers. They don\'t just make your website, instead they build your brand. Again Thankyou Haadi for helping us.',
    rating: 5,
    date: '2026-06-22',
    tag: 'Verified #3',
    initial: 'H'
  },
  {
    id: 4,
    name: 'Hazik Mudasir Bhat',
    email: null,
    review: 'Very great experience, 100% recommended. I know him personally, while we didn\'t work for a website together, instead we needed some digital help, and Haadi himself truly helped us solve our problem..I recommed him strongly',
    rating: 5,
    date: '2026-07-02',
    isDarkCard: true,
    tag: 'Personal Recommendation',
    initial: 'H'
  },
  {
    id: 5,
    name: 'Arif Imtiyaz',
    email: null,
    review: 'While I personally found qurevo very great, there was a slight delay (approx one day) in the website submission due to technical problems. We dont blame them at all, as it was a technical glitch. Qurevo Technologies are 100% recommemded for businesses in kashmir and all over india..',
    rating: 5,
    date: '2026-06-28',
    tag: 'Verified #4',
    initial: 'A'
  },
  {
    id: 6,
    name: 'Imtiyaz Ahmad Bhat',
    email: null,
    review: 'I have worked with Qurevo\'s founder two times personally, and I would recommend him as a greaat choice in terms of his webdesign and development skills.',
    rating: 5,
    date: '2026-07-05',
    tag: 'Repeat Client',
    initial: 'I'
  },
  {
    id: 7,
    name: 'Aiman',
    email: 'aimanraja048@gmail.com',
    review: 'Nice',
    rating: 5,
    date: '2026-07-10',
    tag: 'Verified Client',
    initial: 'A'
  },
  {
    id: 8,
    name: 'Hazik',
    email: null,
    review: 'Great choice for business.. Recommended ',
    rating: 5,
    date: '2026-07-12',
    tag: 'Business Client',
    initial: 'H'
  },
  {
    id: 9,
    name: 'Suhail ahmad war',
    email: null,
    review: 'Best service provider in the valley. They build your website according to your needs easily access and 100%secure Trust worthy ',
    rating: 5,
    date: '2026-07-18',
    tag: 'Kashmir Business Client',
    initial: 'S'
  },
  {
    id: 10,
    name: 'Burhan',
    email: 'burhangull14@gmail.com',
    review: ' I was honestly impressed with the quality of service. The website provides effective solutions that can help businesses grow without requiring a huge investment. Everything is straightforward, professional, and easy to understand. What I liked most is that it offers real value for money. The results and support are worth much more than the cost. If you\'re looking for a reliable platform to improve your business and reach more customers, I would definitely recommend giving it a try.',
    rating: 5,
    date: '2026-07-22',
    isDarkCard: true,
    tag: 'High Value Review',
    initial: 'B'
  },
  {
    id: 11,
    name: 'Faisal',
    email: null,
    review: 'Value for money',
    rating: 5,
    date: '2026-07-25',
    tag: 'Verified #11',
    initial: 'F'
  },
  {
    id: 12,
    name: 'ASRAR SHABIR',
    email: 'asrarshabir2007@gmail.com',
    review: 'Minimal, elegant, and thoughtfully crafted. Every detail reflects creativity and dedication. Great job!',
    rating: 5,
    date: '2026-07-28',
    tag: 'Design & Craft Review',
    initial: 'A'
  },
  {
    id: 13,
    name: 'Umar',
    email: null,
    review: 'Good 💯',
    rating: 5,
    date: '2026-07-30',
    tag: 'Verified #13',
    initial: 'U'
  },
  {
    id: 14,
    name: 'Hadi',
    email: 'vnnghgcg@gmail.com',
    review: 'Honestly, the quality of service here blew me away. The website offers high-impact solutions that help businesses scale without breaking the bank. Everything is clear, professional, and incredibly intuitive. The biggest highlight for me is the incredible ROI—the results and customer support are worth way more than the price tag. If you’re searching for a reliable platform to grow your brand and connect with more customers, this is definitely it.',
    rating: 5,
    date: '2026-08-02',
    tag: 'Featured Scaling Review',
    initial: 'H'
  }
];

export default function ClientTestimonialsPage() {
  // Generate JSON-LD Structured Data for Google Search Indexing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Qurevo Technologies',
    'image': 'https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp',
    '@id': 'https://qurevo.in',
    'url': 'https://qurevo.in/reviews/client-testimonials',
    'priceRange': '₹10,000 - ₹20,000',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Srinagar',
      'addressRegion': 'Jammu & Kashmir',
      'addressCountry': 'IN',
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5.0',
      'reviewCount': '15',
      'bestRating': '5',
      'worstRating': '1',
    },
    'review': clientReviews.map((rev) => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': rev.name,
      },
      'datePublished': rev.date,
      'reviewBody': rev.review,
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': rev.rating.toString(),
        'bestRating': '5',
        'worstRating': '1',
      },
      'itemReviewed': {
        '@type': 'Organization',
        'name': 'Qurevo Technologies',
      },
    })),
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap" rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] flex flex-col font-sans selection:bg-[#0058bc] selection:text-white relative">
        <Navbar />

        <main className="w-full pt-24 pb-16 flex-1 relative overflow-hidden bg-[#f8f9ff]">
          
          {/* HERO SECTION BACKGROUND IMAGE WITH PERFORMANCE ATTRIBUTES */}
          <div className="absolute top-0 left-0 w-full h-[650px] pointer-events-none z-0 overflow-hidden">
            <img
              src="https://res.cloudinary.com/dpqsadqxj/image/upload/v1785998158/ChatGPT_Image_Aug_6_2026_12_05_30_PM_kwvdvh.png"
              alt="Qurevo Hero Background"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-900/15 to-[#f8f9ff]" />
          </div>

          {/* STATIC DOT FIELD BACKGROUND (PRE-OPTIMIZED FOR MAXIMUM SPEED) */}
          <ReviewsBackground />

          {/* HERO SECTION */}
          <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-8 flex flex-col items-start text-left z-10">
            
            {/* BADGE TILE WITH FOLDTEXT ANIMATION */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-[0_4px_20px_rgba(0,88,188,0.08)] mb-6 border border-slate-200/80">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0058bc] animate-pulse" />
              <FoldText
                text="100% ORGANIC CLIENT FEEDBACK WALL"
                splitBy="char"
                hinge="top"
                trigger="scroll"
                duration={0.6}
                stagger={0.02}
                fontSize={12}
                fontWeight={800}
                color="#0058bc"
              />
            </div>

            {/* HERO MAIN TITLE WITH FJALLA ONE FONT */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_15px_35px_rgba(0,88,188,0.06)] mb-6 max-w-4xl w-full">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-['Fjalla_One',sans-serif] uppercase tracking-wide text-[#0b1c30] leading-tight text-left">
                Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0058bc] to-[#008188]">Visionaries</span> &amp; Industry Leaders.
              </h1>
            </div>

            {/* THE SINGLE HERO FROSTED GLASSMORPHISM CARD (EXACT MATCH TO REFERENCE IMAGE) */}
            <div className="backdrop-blur-xl bg-white/55 border-[1.5px] border-white/85 p-6 sm:p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,88,188,0.08),_inset_0_1.5px_2px_rgba(255,255,255,0.95)] max-w-4xl text-left space-y-4 relative overflow-hidden my-2">
              <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-[#0058bc] to-[#008188]" />
              <p className="text-base sm:text-xl font-bold text-[#0b1c30] leading-snug tracking-tight text-left">
                &ldquo;Qurevo Technologies presents its independent reviews organically as each person has the access to review us through our website. Every testimonial below is authentic, unedited, and logged directly by real clients who experienced our web development services.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#414755] font-medium leading-relaxed text-justify">
                At Qurevo Technologies, transparency is the bedrock of our digital engineering philosophy. Headquartered in Srinagar, Jammu &amp; Kashmir, we empower businesses, hospitality ventures, literary authors, educational consultancies, and digital brands across India with custom Next.js web applications, lightning-fast SEO architecture, and uncompromising UX precision.
              </p>
            </div>
          </section>

          {/* INFINITE LOOPING CAPABILITY RIBBON (PROMINENT LARGE TICKER WITH TOP 15 TECHS) */}
          <section className="relative w-full my-6 py-2 overflow-hidden z-10 pointer-events-auto bg-white border-y border-slate-200/80 shadow-xs">
            <TextLoop
              text="⚡ NEXT.JS 16 ✦ REACT 19 ✦ TYPESCRIPT ✦ TAILWIND CSS ✦ HTML5 & CSS3 ✦ JAVASCRIPT ✦ KOTLIN ✦ JAVA ✦ FIREBASE & FIRESTORE ✦ MONGODB & POSTGRESQL ✦ VERCEL ✦ NETLIFY ✦ GCP CLOUD ✦ FLUTTER ✦ AI & LLM INTEGRATION"
              shape="line"
              speed={75}
              color="#0b1c30"
              ribbon={true}
              ribbonColor="rgba(218, 226, 253, 0.9)"
              ribbonWidth={72}
              fontSize={22}
              fontWeight={900}
              letterSpacing={2.5}
            />
          </section>

          {/* TRUST METRICS SHOWCASE */}
          <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Metric 1: Overall Client Rating */}
              <div className="bg-gradient-to-br from-white via-[#fffdf5] to-[#fefce8] rounded-3xl p-6 sm:p-7 shadow-md border-2 border-amber-400/50 hover:border-amber-500 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/90 border border-amber-300/60 flex items-center justify-center text-amber-600 shadow-xs">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300/60 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wide">
                    100% Genuine
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-4xl sm:text-5xl font-['Fjalla_One',sans-serif] tracking-tight text-[#0b1c30]">5.0</span>
                    <div className="flex text-amber-500 text-sm sm:text-base">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-[#0b1c30] uppercase tracking-wider text-left">Overall Client Rating</h4>
                  <p className="text-[11px] text-slate-500 font-medium text-left pt-0.5">Based on 15 verified client evaluations</p>
                </div>
              </div>

              {/* Metric 2: Verified Reviews */}
              <div className="bg-gradient-to-br from-white via-[#f0fdf4] to-[#ecfdf5] rounded-3xl p-6 sm:p-7 shadow-md border-2 border-emerald-600/40 hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 border border-emerald-500/40 flex items-center justify-center text-emerald-800 shadow-xs">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-600/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wide">
                    Hash Verified
                  </div>
                </div>
                <div>
                  <span className="text-4xl sm:text-5xl font-['Fjalla_One',sans-serif] tracking-tight text-[#0b1c30] mb-1 block">15+</span>
                  <h4 className="text-xs font-mono font-bold text-[#0b1c30] uppercase tracking-wider text-left">Verified Reviews</h4>
                  <p className="text-[11px] text-emerald-800 font-medium text-left pt-0.5">Logged &amp; Approved by founders</p>
                </div>
              </div>

              {/* Metric 3: Satisfaction Rate */}
              <div className="bg-gradient-to-br from-white via-[#f4f7ff] to-[#eef2ff] rounded-3xl p-6 sm:p-7 shadow-md border-2 border-blue-500/40 hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/90 border border-blue-400/40 flex items-center justify-center text-blue-700 shadow-xs">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wide">
                    Zero Complaints
                  </div>
                </div>
                <div>
                  <span className="text-4xl sm:text-5xl font-['Fjalla_One',sans-serif] tracking-tight text-[#0b1c30] mb-1 block">100%</span>
                  <h4 className="text-xs font-mono font-bold text-[#0b1c30] uppercase tracking-wider text-left">Satisfaction Rate</h4>
                  <p className="text-[11px] text-blue-800 font-medium text-left pt-0.5">Delivered with high performance &amp; support</p>
                </div>
              </div>

            </div>
          </section>

          {/* IN-DEPTH SERVICES & SOLUTIONS CAPABILITY SHOWCASE (A TO Z ALL-IN-ONE PLACE) */}
          <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 z-10">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
              
              {/* CLEAR GAP BETWEEN BADGE & HEADING */}
              <div className="flex flex-col items-start gap-4 mb-6">
                <div className="inline-block text-[11px] font-mono font-bold text-[#0058bc] uppercase tracking-widest bg-[#dce9ff] px-3.5 py-1.5 rounded-full border border-[#0058bc]/20">
                  End-to-End Digital Engineering Excellence
                </div>
                <h2 className="text-3xl sm:text-5xl font-['Fjalla_One',sans-serif] uppercase tracking-wide text-[#0b1c30] text-left pt-1">
                  What We Build: From Concept to Production (A to Z)
                </h2>
                <p className="text-sm sm:text-base text-[#414755] font-medium max-w-3xl text-left">
                  Qurevo Technologies is a full-stack digital solution house. We architect, code, test, deploy, and scale high-impact digital tools for brands, startups, and enterprises worldwide.
                </p>
              </div>

              {/* 8-GRID DETAILED CAPABILITY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                
                {/* Capability 1 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#0058bc]/10 flex items-center justify-center text-[#0058bc]">
                    <span className="material-symbols-outlined text-2xl">cloud_done</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">SaaS Tools &amp; Cloud Apps</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Custom multi-tenant SaaS platforms, subscription management, tenant isolation, and automated cloud infrastructure built on Next.js &amp; GCP.
                  </p>
                </div>

                {/* Capability 2 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#008188]/10 flex items-center justify-center text-[#008188]">
                    <span className="material-symbols-outlined text-2xl">dashboard_customize</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">Enterprise Software &amp; Dashboards</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Operational management tools, real-time analytics portals, automated data pipelines, and ERP systems tailored for corporate workflows.
                  </p>
                </div>

                {/* Capability 3 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#0070eb]/10 flex items-center justify-center text-[#0070eb]">
                    <span className="material-symbols-outlined text-2xl">smart_toy</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">AI Automation &amp; Agents</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Autonomous AI agents, document extraction bots, automated social workflows, and custom multi-step task execution systems.
                  </p>
                </div>

                {/* Capability 4 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#5c647a]/15 flex items-center justify-center text-[#565e74]">
                    <span className="material-symbols-outlined text-2xl">psychology</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">AI Model &amp; LLM Integration</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Deep integration of Gemini, OpenAI, RAG vector search, fine-tuned embeddings, and semantic knowledge retrieval engines.
                  </p>
                </div>

                {/* Capability 5 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#0058bc]/10 flex items-center justify-center text-[#0058bc]">
                    <span className="material-symbols-outlined text-2xl">forum</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">Chatbots &amp; Live Support</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Embedded AI customer support widgets, real-time Firestore chat sync, automated lead qualification, and instant response bots.
                  </p>
                </div>

                {/* Capability 6 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#008188]/10 flex items-center justify-center text-[#008188]">
                    <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">Full E-Commerce Solutions</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Custom digital storefronts, checkout engines, payment gateway integrations (Razorpay/Stripe), inventory sync, and order management.
                  </p>
                </div>

                {/* Capability 7 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#0070eb]/10 flex items-center justify-center text-[#0070eb]">
                    <span className="material-symbols-outlined text-2xl">phone_iphone</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">Mobile &amp; Web Apps</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Cross-platform mobile applications for iOS &amp; Android built with Flutter or React Native, paired with progressive web app capabilities.
                  </p>
                </div>

                {/* Capability 8 */}
                <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/70 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#5c647a]/15 flex items-center justify-center text-[#565e74]">
                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0b1c30] text-left">High-Speed Landing Pages</h3>
                  <p className="text-xs text-[#414755] leading-relaxed text-left">
                    Custom conversion-optimized landing pages with 95+ Lighthouse performance scores, Glassmorphism UI, and custom WebGL shaders.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* DETAILED SEO OVERVIEW & BRAND ENGINEERING SECTION */}
          <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16 z-10">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex flex-col items-start gap-3">
                <span className="inline-block text-[10px] font-mono font-bold text-[#0058bc] uppercase tracking-widest bg-[#dce9ff] px-3 py-1 rounded-full border border-[#0058bc]/20">
                  Organic Client Verification Standard
                </span>
                <h2 className="text-2xl sm:text-4xl font-['Fjalla_One',sans-serif] uppercase tracking-wide text-[#0b1c30] text-left pt-1">
                  Why Qurevo Technologies Leads Web Innovation in Kashmir &amp; India
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#414755] leading-relaxed">
                <p className="text-justify font-medium">
                  Every review displayed on this portal reflects an authentic digital project delivered by Qurevo Technologies. From local Kashmir enterprises like educational consultancies and boutique hotels to international author portfolios (such as Sheikh Rahil Yousuf&apos;s literary showcase), our engineering team crafts custom full-stack solutions tailored to specific commercial goals.
                </p>
                <p className="text-justify font-medium">
                  We don&apos;t build generic websites; we architect secure, high-conversion web ecosystems built with React, Next.js, Cloud Firestore, and Tailwind CSS. By combining custom canvas graphics, steganographic verification hashes, and lighthouse performance optimization, Qurevo Technologies ensures every client receives maximum digital return on investment.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex flex-wrap gap-3 text-xs font-mono text-[#0058bc]">
                <span className="bg-[#f8f9ff] px-3 py-1.5 rounded-xl border border-slate-200 font-bold shadow-xs">⚡ Next.js 16 Architecture</span>
                <span className="bg-[#f8f9ff] px-3 py-1.5 rounded-xl border border-slate-200 font-bold shadow-xs">🛡️ Firestore Security Verification</span>
                <span className="bg-[#f8f9ff] px-3 py-1.5 rounded-xl border border-slate-200 font-bold shadow-xs">🚀 95+ Core Web Vitals</span>
                <span className="bg-[#f8f9ff] px-3 py-1.5 rounded-xl border border-slate-200 font-bold shadow-xs">📍 Srinagar, Kashmir HQ</span>
              </div>
            </div>
          </section>

          {/* MASONRY & BENTO TESTIMONIALS GRID (SOLID ULTRA-FAST CARDS WITH VERIFIED BADGES) */}
          <section className="relative w-full py-16 border-y border-slate-200/80 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 text-left">
                <div>
                  <h2 className="text-3xl sm:text-5xl font-['Fjalla_One',sans-serif] uppercase tracking-wide text-[#0b1c30] mb-2 text-left">
                    Authentic Client Experiences
                  </h2>
                  <p className="text-sm text-[#414755] font-medium text-left">
                    Read unedited feedback directly logged by founders, creators, and business leaders.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-[#0058bc] shadow-xs">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>15 Genuine Reviews Logged</span>
                </div>
              </div>

              {/* BENTO GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
                
                {/* NEW FLAGSHIP FEATURED COLLABORATOR REVIEW (#15: Musaib Manzoor) */}
                <div className="md:col-span-12 bg-gradient-to-br from-white via-[#f0fdf4] to-[#fefce8] rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-emerald-600/40 hover:border-emerald-600 text-left relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group">
                  <div className="absolute top-0 right-0 p-8 opacity-15 text-amber-500 pointer-events-none">
                    <span className="material-symbols-outlined text-[160px]">format_quote</span>
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src="https://res.cloudinary.com/dpqsadqxj/image/upload/v1785268745/0373dd5d-6f33-49cb-813e-61afaf3e51c3.png"
                            alt="Musaib Manzoor - Founder of MyExpert"
                            decoding="async"
                            className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-amber-400"
                          />
                          <div className="text-left">
                            <h3 className="font-extrabold text-xl sm:text-2xl text-[#0b1c30] text-left tracking-tight">Musaib Manzoor</h3>
                            <p className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider text-left">Founder of MyExpert • Official Collaborator</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 border border-emerald-600/40 px-4 py-1.5 rounded-full text-xs font-extrabold text-emerald-900 shadow-xs">
                            <span className="material-symbols-outlined text-sm text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span> Official Collaborator
                          </div>
                          <div className="flex text-amber-500 text-base">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-base sm:text-xl text-[#0b1c30] leading-relaxed italic font-medium text-justify pt-2">
                        &ldquo;Working with this web development company was a great experience from start to finish. They understood exactly what I wanted and turned my ideas into a modern, fast, and professional website. The team was responsive, easy to communicate with, and delivered everything on time. The website looks amazing on both mobile and desktop, loads quickly, and feels very polished. They also paid attention to the small details that make a big difference in user experience. If you&apos;re looking for a reliable web development company that delivers high-quality work and excellent support, I would definitely recommend them.&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-emerald-200/80 text-xs font-mono text-emerald-950 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-700 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> MyExpert Founder Verification #15
                      </span>
                      <span className="text-amber-700 font-extrabold uppercase tracking-wide">Official Collaboration</span>
                    </div>
                  </div>
                </div>

                {/* Featured Review (#1: Wani Murtaza) */}
                <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-emerald-600/30 hover:border-emerald-600 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 text-left">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-[#0058bc] pointer-events-none">
                    <span className="material-symbols-outlined text-[130px]">format_quote</span>
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-700 to-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md border border-amber-200">
                            W
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-lg text-[#0b1c30] text-left">Wani Murtaza</h3>
                            <p className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider text-left font-semibold">Verified Client #1</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 border border-emerald-600/40 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-900">
                          <span className="material-symbols-outlined text-sm text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                        </div>
                      </div>
                      <p className="text-xl sm:text-2xl text-[#0b1c30] leading-relaxed mb-6 italic font-medium text-left">
                        &ldquo;Truly nice behaivior, and got 50% off on my website due to their collaboration offer.&rdquo;
                      </p>
                    </div>
                    <div className="flex text-amber-500 text-base pt-2">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                </div>

                {/* Medium Review (#2: Sheikh Rahil Yousuf) */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-600/35 hover:border-emerald-600 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Sheikh Rahil Yousuf</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 italic font-medium text-justify">
                      &ldquo;I think it&apos;s lovelier than the love of jove I am profoundly exhilarated to have discovered this exquisite platform. It has bestowed upon my mind a rare tranquility and transformed my writings into enduring keepsakes, preserving both my thoughts and my voice against the erosion of time.&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Author Portfolio #2</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* Standard Review Cards Grid (#3 to #14) */}
                
                {/* #3: Hinan */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-amber-400/40 hover:border-amber-500 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Hinan</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;I must say, Qurevo Technologies is one of the top, modern web solution providers. They don&apos;t just make your website, instead they build your brand. Again Thankyou Haadi for helping us.&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #3</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #4: Hazik Mudasir Bhat (Dark Card with Gold & Emerald Accents) */}
                <div className="md:col-span-4 bg-[#0b1c30] rounded-3xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 border-2 border-emerald-500/40 hover:border-emerald-400 text-left">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-white text-left">Hazik Mudasir Bhat</h3>
                      <div className="flex text-amber-400 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4 italic font-medium text-left">
                      &ldquo;Very great experience, 100% recommended. I know him personally, while we didn&apos;t work for a website together, instead we needed some digital help, and Haadi himself truly helped us solve our problem..I recommed him strongly&rdquo;
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-slate-700">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Verified #4</span>
                    <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #5: Arif Imtiyaz */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-600/35 hover:border-emerald-600 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Arif Imtiyaz</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;While I personally found qurevo very great, there was a slight delay (approx one day) in the website submission due to technical problems. We dont blame them at all, as it was a technical glitch. Qurevo Technologies are 100% recommemded for businesses in kashmir and all over india..&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #5</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #6: Imtiyaz Ahmad Bhat */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-amber-400/40 hover:border-amber-500 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Imtiyaz Ahmad Bhat</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;I have worked with Qurevo&apos;s founder two times personally, and I would recommend him as a greaat choice in terms of his webdesign and development skills.&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Repeat Client #6</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #7: Aiman */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-600/35 hover:border-emerald-600 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-left">
                        <h3 className="font-bold text-base text-[#0b1c30] text-left">Aiman</h3>
                        <p className="text-[10px] font-mono text-slate-400 text-left">aimanraja048@gmail.com</p>
                      </div>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;Nice&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #7</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #8: Hazik */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-amber-400/40 hover:border-amber-500 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Hazik</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;Great choice for business.. Recommended &rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #8</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #9: Suhail ahmad war */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-600/35 hover:border-emerald-600 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Suhail ahmad war</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;Best service provider in the valley. They build your website according to your needs easily access and 100%secure Trust worthy &rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #9</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #10: Burhan (Dark Card) */}
                <div className="md:col-span-8 bg-[#0b1c30] rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 border-2 border-emerald-500/40 hover:border-emerald-400 text-left">
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-[#0070eb] pointer-events-none">
                    <span className="material-symbols-outlined text-[130px]">format_quote</span>
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="font-bold text-lg text-white text-left">Burhan</h3>
                        <p className="text-[10px] font-mono text-slate-400 text-left">burhangull14@gmail.com</p>
                      </div>
                      <div className="flex text-amber-400 text-sm">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-base text-slate-200 leading-relaxed italic font-medium text-justify">
                      &ldquo;I was honestly impressed with the quality of service. The website provides effective solutions that can help businesses grow without requiring a huge investment. Everything is straightforward, professional, and easy to understand. What I liked most is that it offers real value for money. The results and support are worth much more than the cost. If you&apos;re looking for a reliable platform to improve your business and reach more customers, I would definitely recommend giving it a try.&rdquo;
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Verified Review #10</span>
                    <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #11: Faisal */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-amber-400/40 hover:border-amber-500 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Faisal</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;Value for money&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #11</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #12: ASRAR SHABIR */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-emerald-600/35 hover:border-emerald-600 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-left">
                        <h3 className="font-bold text-base text-[#0b1c30] text-left">ASRAR SHABIR</h3>
                        <p className="text-[10px] font-mono text-slate-400 text-left">asrarshabir2007@gmail.com</p>
                      </div>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;Minimal, elegant, and thoughtfully crafted. Every detail reflects creativity and dedication. Great job!&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #12</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #13: Umar */}
                <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-amber-400/40 hover:border-amber-500 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-[#0b1c30] text-left">Umar</h3>
                      <div className="flex text-amber-500 text-xs">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#414755] leading-relaxed mb-4 font-medium text-left">
                      &ldquo;Good 💯&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-100">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified #13</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

                {/* #14: Hadi */}
                <div className="md:col-span-12 bg-gradient-to-r from-white via-[#f0fdf4] to-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-emerald-600/35 hover:border-emerald-600 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="font-bold text-lg text-[#0b1c30] text-left">Hadi</h3>
                        <p className="text-[10px] font-mono text-slate-500 text-left">vnnghgcg@gmail.com</p>
                      </div>
                      <div className="flex text-amber-500 text-sm">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-base text-[#0b1c30] leading-relaxed italic font-medium text-justify">
                      &ldquo;Honestly, the quality of service here blew me away. The website offers high-impact solutions that help businesses scale without breaking the bank. Everything is clear, professional, and incredibly intuitive. The biggest highlight for me is the incredible ROI—the results and customer support are worth way more than the price tag. If you’re searching for a reliable platform to grow your brand and connect with more customers, this is definitely it.&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-emerald-200/80">
                    <span className="text-[10px] font-mono text-[#717786] uppercase font-semibold">Verified Review #14</span>
                    <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
