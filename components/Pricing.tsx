"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const plans = [
  { name: "Starter", price: "$999", features: ["1-3 Pages Landing Page", "Mobile Responsive", "Basic SEO", "1 Week Delivery"], popular: false },
  { name: "Growth", price: "$2,499", features: ["Up to 8 Pages", "Custom Animations", "CMS Integration", "Advanced SEO", "Analytics Setup"], popular: true },
  { name: "Premium", price: "Custom", features: ["Unlimited Pages", "Full Stack Web App", "User Authentication", "Database Architecture", "Priority Support"], popular: false }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-600">Choose the perfect package for your brand.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-3xl border ${plan.popular ? 'border-brand-500 shadow-soft bg-white scale-105 z-10' : 'border-slate-200 bg-slate-50'}`}
          >
            {plan.popular && <span className="bg-brand-500 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide mb-4 inline-block">Most Popular</span>}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">{plan.price}</div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 size={18} className="text-brand-500" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-full font-medium transition-all ${plan.popular ? 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-glow' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}