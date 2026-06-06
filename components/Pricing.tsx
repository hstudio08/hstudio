"use client";

import React from 'react';

export default function Pricing() {
  const matrices = [
    {
      name: "Starter",
      price: "₹10,000",
      desc: "Perfect for startups & individuals",
      popular: false,
      cardStyle: "bg-white border-slate-100 shadow-sm hover:border-slate-200 hover:-translate-y-1",
      buttonStyle: "border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50",
      features: ["Landing Page", "Responsive Design", "Basic SEO", "Contact Form", "1 Week bug fixes", "One week Email Support"]
    },
    {
      name: "Growth",
      price: "₹15,000",
      desc: "Best for growing businesses",
      popular: false,
      cardStyle: "bg-[#a7fcfb]/10 border-[#a7fcfb]/40 shadow-sm hover:border-[#a7fcfb]/80 hover:-translate-y-1",
      buttonStyle: "border border-[#a7fcfb] text-slate-800 bg-[#a7fcfb]/20 hover:bg-[#a7fcfb]/40",
      features: ["Upto 5 Pages", "Responsive Design", "Advanced SEO", "CMS Integration (Basic)", "1 Revision", "One Week Whatsapp Support + Email Support", "Contact Form", "Admin Panel", "1 week bug fixes", "Upto 50 Products/Services", "Social Media Integration"]
    },
    {
      name: "Premium",
      price: "₹20,000",
      desc: "For brands that want the best",
      popular: true,
      cardStyle: "bg-gradient-to-br from-[#a7fcfb] to-[#b4f7ab] border-transparent shadow-[0_15px_40px_rgba(167,252,251,0.3)] md:-translate-y-2 scale-[1.02] hover:scale-[1.03]",
      buttonStyle: "bg-slate-950 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10",
      features: ["Upto 10 Pages", "Premium Design", "Advanced SEO", "Custom Features", "1-2 Revisions", "10 days Priority Support (Call/Whatsapp/Email)", "Contact Form", "Admin Panel", "10 month bug fixes", "Upto 150 Products/Services (Expandable)", "Payment Gateway Integration", "Blog/News Section", "Analytics Setup", "Social Media Integration"]
    }
  ];

  // Dispatches a custom event with the package name and scrolls smoothly to the form
  const handleGetStarted = (e: React.MouseEvent, tierName: string) => {
    e.preventDefault();
    const mappedValue = tierName === 'Starter' ? 'Starter - ₹10,000' :
                        tierName === 'Growth' ? 'Growth - ₹15,000' :
                        'Premium - ₹20,000';

    window.dispatchEvent(new CustomEvent('preselectPackage', { detail: mappedValue }));
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="packages" className="py-16 md:py-24 bg-slate-50/40 relative z-10">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Pricing Subtitle Section Header */}
        <div className="text-center flex flex-col items-center space-y-2 md:space-y-3 mb-10 md:mb-16">
          <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full font-['Familjen_Grotesk'] shadow-sm">
            Packages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-slate-950 font-['Foldit'] tracking-wide drop-shadow-sm px-2">
            Simple Packages. Powerful Results.
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-slate-500 font-['Story_Script'] max-w-sm md:max-w-none">
            Choose the perfect package for your business needs.
          </p>
        </div>

        {/* 3-Tier Execution Content Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-stretch">
          {matrices.map((tier, idx) => (
            <div 
              key={idx}
              className={`border rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative transition-all duration-300 overflow-hidden ${tier.cardStyle}`}
            >
              
              <div className="relative z-10">
                {/* Conditional Popular Float Badge */}
                {tier.popular && (
                  <span className="absolute top-0 right-0 md:right-1/2 md:translate-x-1/2 -translate-y-1/2 bg-slate-950 text-[#b4f7ab] font-black text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md font-['Familjen_Grotesk']">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-950 tracking-tight">{tier.name}</h3>
                  <p className={`text-xs md:text-sm mt-1.5 font-medium ${tier.popular ? 'text-slate-700' : 'text-slate-500'}`}>
                    {tier.desc}
                  </p>
                  
                  {/* Fiscal Allocation Indexer */}
                  <div className="my-6 flex items-baseline">
                    <span className="text-4xl md:text-5xl font-black tracking-tight font-['Familjen_Grotesk'] text-slate-950">{tier.price}</span>
                  </div>

                  {/* Granular Core Line-Item Benefits Checklist */}
                  <ul className={`space-y-3 md:space-y-4 border-t pt-6 ${tier.popular ? 'border-slate-900/10' : 'border-slate-200/60'}`}>
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className={`flex items-start space-x-2.5 text-xs md:text-[13px] font-bold ${tier.popular ? 'text-slate-800' : 'text-slate-700'}`}>
                        <span className={`${tier.popular ? 'text-slate-950' : 'text-blue-500'} font-black mt-[1px]`}>✓</span>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conversion Trigger Actions */}
              <div className="pt-8 relative z-10 mt-auto">
                <button 
                  onClick={(e) => handleGetStarted(e, tier.name)}
                  className={`w-full font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-xl transition-all duration-300 uppercase tracking-widest font-['Familjen_Grotesk'] ${tier.buttonStyle}`}
                >
                  Get Started
                </button>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}