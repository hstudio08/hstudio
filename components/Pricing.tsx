"use client";

import React from 'react';

export default function Pricing() {
  const matrices = [
    {
      name: "Starter",
      price: "₹10,000",
      desc: "Perfect for startups & individuals",
      popular: false,
      cardStyle: "bg-white border-slate-100 shadow-sm hover:border-slate-200",
      buttonStyle: "border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50",
      features: ["Landing Page", "Responsive Design", "Basic SEO", "Contact Form", "1 Week bug fixes", "One week Email Support"]
    },
    {
      name: "Growth",
      price: "₹15,000",
      desc: "Best for growing businesses",
      popular: false,
      cardStyle: "bg-[#a7fcfb]/10 border-[#a7fcfb]/40 shadow-sm hover:border-[#a7fcfb]/80",
      buttonStyle: "border border-[#a7fcfb] text-slate-800 bg-[#a7fcfb]/20 hover:bg-[#a7fcfb]/40",
      features: ["Upto 5 Pages", "Responsive Design", "Advanced SEO", "CMS Integration (Basic)", "1 Revision", "One Week Whatsapp Support + Email Support", "Contact Form", "Admin Panel", "1 week bug fixes", "Upto 50 Products/Services", "Social Media Integration"]
    },
    {
      name: "Premium",
      price: "₹20,000",
      desc: "For brands that want the best",
      popular: true,
      cardStyle: "bg-gradient-to-br from-[#a7fcfb] to-[#b4f7ab] border-transparent shadow-lg md:-translate-y-2 scale-[1.02]",
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
    <section id="packages" className="py-20 bg-slate-50/40">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-8">
        
        {/* Pricing Subtitle Section Header */}
        <div className="text-center flex flex-col items-center space-y-2 mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Packages</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">Simple Packages. Powerful Results.</h2>
          <p className="text-sm text-slate-500">Choose the perfect package for your business needs.</p>
        </div>

        {/* 3-Tier Execution Content Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {matrices.map((tier, idx) => (
            <div 
              key={idx}
              className={`border rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 hover:shadow-xl ${tier.cardStyle}`}
            >
              {/* Conditional Popular Float Badge */}
              {tier.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-slate-950 text-[#b4f7ab] font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-950">{tier.name}</h3>
                <p className={`text-xs mt-1 ${tier.popular ? 'text-slate-700' : 'text-slate-500'}`}>
                  {tier.desc}
                </p>
                
                {/* Fiscal Allocation Indexer */}
                <div className="my-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-950 tracking-tight">{tier.price}</span>
                </div>

                {/* Granular Core Line-Item Benefits Checklist */}
                <ul className={`space-y-3 border-t pt-6 ${tier.popular ? 'border-slate-900/10' : 'border-slate-200/60'}`}>
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-800 font-medium">
                      <span className={`${tier.popular ? 'text-slate-950' : 'text-blue-500'} font-black mt-0.5`}>✓</span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversion Trigger Vector Actions */}
              <div className="pt-8">
                <button 
                  onClick={(e) => handleGetStarted(e, tier.name)}
                  className={`w-full font-semibold text-xs py-3 rounded-xl transition-all duration-200 ${tier.buttonStyle}`}
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