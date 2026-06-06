"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Grainient from '../effects/Grainient';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    packageType: '',
    email: '',
    message: ''
  });

  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [actualOtp, setActualOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pulseHighlight, setPulseHighlight] = useState(false);

  useEffect(() => {
    const handlePreselect = (e: any) => {
      setFormData(prev => ({ ...prev, packageType: e.detail }));
      setPulseHighlight(true);
      setTimeout(() => setPulseHighlight(false), 2500);
    };
    
    window.addEventListener('preselectPackage', handlePreselect);
    return () => window.removeEventListener('preselectPackage', handlePreselect);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Fallback safeguard in JS just in case maxLength is bypassed
    if (name === 'message' && value.length > 230) {
      return; 
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOTP = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.email) return alert("Please enter your email first.");
    
    setOtpStatus('sending');
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setActualOtp(generatedOTP);
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: formData.email,
          passcode: generatedOTP,
          time: new Date(Date.now() + 15 * 60000).toLocaleTimeString()
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setTimeout(() => setOtpStatus('sent'), 300);
    } catch (error) {
      alert("Failed to send OTP. Please check your email address and try again.");
      setOtpStatus('idle');
    }
  };

  const handleVerifyOTP = (e: React.MouseEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) return;
    
    setOtpStatus('verifying');
    setTimeout(() => {
      if (otpCode === actualOtp) {
        setOtpStatus('verified');
      } else {
        alert("Invalid OTP. Please try again.");
        setOtpStatus('sent');
        setOtpCode('');
      }
    }, 500); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpStatus !== 'verified') return alert("Please verify your email first.");
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "booking_requests"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new"
      });
      alert("Project request submitted successfully! We will contact you soon.");
      setFormData({ name: '', phone: '', packageType: '', email: '', message: '' });
      setOtpStatus('idle');
      setOtpCode('');
      setActualOtp('');
    } catch (error) {
      alert("Failed to submit request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="pt-16 md:pt-24 pb-8 md:pb-12 bg-slate-50 overflow-hidden flex flex-col relative z-0">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-shimmer-sweep { animation: shimmer-sweep 2.5s infinite linear; }
        .animate-bounce-horizontal { animation: bounce-horizontal 1.5s infinite ease-in-out; }
      `}} />

      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />

      <div className="max-w-[96rem] mx-auto px-3 sm:px-6 md:px-8 w-full relative z-10">
        
        {/* Main Glassmorphic Card Container */}
        <div className="relative rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.06)] md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white/80 overflow-hidden flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-stretch min-h-[600px]">
          
          {/* 1. The Fluid Grainient Background */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <Grainient
              color1="#86d1fd"
              color2="#9f8af6"
              color3="#c4eb5a"
              saturation={0.9} 
              timeSpeed={0.25}
              warpStrength={1.0}
              warpFrequency={5.0}
              warpSpeed={0.05}
              warpAmplitude={30.0}
              blendAngle={0.0}
              blendSoftness={0.09}
              rotationAmount={500.0}
              noiseScale={2.0}
              grainAmount={0.06} // Slightly increased so it pops
              grainScale={2.0}
              grainAnimated={true} // Turned ON so the grain twinkles realistically
              contrast={3.0} // Increased contrast for more punch
              gamma={1.0}
              centerX={0.0}
              centerY={0.0}
              zoom={0.9}
              className="w-full h-full"
            />
          </div>
          {/* 2. Soft white overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-white/30" />

          {/* Left Column: Branding & Info */}
          <div className="p-6 md:p-14 lg:col-span-5 flex flex-col relative z-10 h-full justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)] mb-5 md:mb-8 flex items-center justify-center border border-slate-100 transform hover:scale-105 transition-transform duration-500">
                  <Image src="/logo.png" alt="Qurevo Technologies Brand Logo" width={48} height={48} className="w-8 md:w-12 h-auto object-contain" />
                </div>
                <h3 className="text-xl sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 mb-3 md:mb-4 drop-shadow-sm">Qurevo Technologies Srinagar</h3>
                <p className="text-xs md:text-sm text-slate-900 leading-relaxed font-medium max-w-sm drop-shadow-sm">  
                  Ready to elevate your brand with Qurevo Technologies? Submit your project details to get started with our expert web development team. We ensure secure form verification, fast response times, and priority onboarding.
                </p>
              </div>
            </div>

            <div className="pt-6 md:pt-8 mt-8 md:mt-12 border-t border-slate-900/10">
              <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-slate-900 font-bold mb-4 md:mb-5">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-sm md:shadow-md flex items-center justify-center text-blue-600">🛡️</span>
                <span className="drop-shadow-sm">Secure OTP Verification</span>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-slate-900 font-bold">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-sm md:shadow-md flex items-center justify-center text-purple-600">⚡</span>
                <span className="drop-shadow-sm">Lightning Fast Response</span>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphic Form */}
          <div className="p-6 md:p-14 lg:col-span-7 relative z-10 bg-white/50 backdrop-blur-md border-l border-white/40">
            <div aria-live="polite" className="sr-only">
              {otpStatus === 'sending' && "Sending verification code."}
              {otpStatus === 'sent' && "Verification code sent to your email."}
              {otpStatus === 'verifying' && "Verifying your code."}
              {otpStatus === 'verified' && "Email successfully verified."}
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="sr-only">Your Full Name</label>
                  <input 
                    id="name"
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    placeholder="Your Full Name" 
                    className="w-full bg-white/80 backdrop-blur-md text-slate-900 placeholder-slate-600 text-sm md:text-base font-medium rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 outline-none border border-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] focus:bg-white focus:shadow-[0_8px_25px_rgba(180,151,207,0.4)] focus:border-[#B497CF] transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[#B497CF]/40"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input 
                    id="phone"
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    placeholder="Phone Number" 
                    className="w-full bg-white/80 backdrop-blur-md text-slate-900 placeholder-slate-600 text-sm md:text-base font-medium rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 outline-none border border-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] focus:bg-white focus:shadow-[0_8px_25px_rgba(180,151,207,0.4)] focus:border-[#B497CF] transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[#B497CF]/40"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="packageType" className="sr-only">Select Package</label>
                <select 
                  id="packageType"
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  className={`w-full appearance-none cursor-pointer rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base font-bold outline-none transition-all duration-300 focus-visible:ring-4
                    ${pulseHighlight 
                      ? 'bg-white shadow-[0_8px_25px_rgba(82,39,255,0.4)] border-2 border-[#5227FF] text-[#5227FF] scale-[1.01]' 
                      : 'bg-white/80 backdrop-blur-md text-slate-800 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-white focus:bg-white focus:shadow-[0_8px_25px_rgba(180,151,207,0.4)] focus:border-[#B497CF] focus-visible:ring-[#B497CF]/40'
                    }
                  `}
                >
                  <option value="" disabled>Select a Package...</option>
                  <option value="Starter - ₹10,000">Starter Package — ₹10,000</option>
                  <option value="Growth - ₹15,000">Growth Package — ₹15,000</option>
                  <option value="Premium - ₹20,000">Premium Package — ₹20,000</option>
                  <option value="Custom Quote">Custom Requirements / Quote</option>
                </select>
                <div className={`absolute right-4 md:right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors font-bold text-xs md:text-sm ${pulseHighlight ? 'text-[#5227FF]' : 'text-slate-600'}`}>▼</div>
              </div>

              <div className="p-1.5 md:p-2 rounded-[1rem] md:rounded-[1.25rem] bg-white/80 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden transition-all duration-500 focus-within:bg-white">
                {otpStatus === 'verified' && <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />}
                
                <div className="flex flex-col sm:flex-row gap-1.5 md:gap-2 relative z-10">
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={otpStatus === 'verified'}
                    required
                    aria-required="true"
                    placeholder="Your Email Address" 
                    className="flex-1 bg-transparent px-3 py-2.5 md:px-4 md:py-3 text-sm font-medium text-slate-900 placeholder-slate-600 outline-none transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#B497CF] rounded-lg"
                  />
                  
                  {otpStatus !== 'verified' && (
                    <button 
                      onClick={handleSendOTP}
                      disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                      aria-busy={otpStatus === 'sending'}
                      className="whitespace-nowrap bg-[#5227FF] hover:bg-[#401fcc] text-white font-bold text-xs px-5 py-3 md:px-6 md:py-3.5 rounded-lg md:rounded-xl transition-all shadow-md shadow-[#5227FF]/20 disabled:opacity-50 flex items-center justify-center min-w-[100px] md:min-w-[120px] focus-visible:ring-4 focus-visible:ring-[#5227FF]/40 outline-none"
                    >
                      {otpStatus === 'sending' ? (
                        <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : otpStatus === 'sent' ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                  
                  {otpStatus === 'verified' && (
                    <div className="flex items-center justify-center px-5 py-3 md:px-6 md:py-3.5 rounded-lg md:rounded-xl bg-green-100/80 text-green-800 font-extrabold text-xs border border-green-200 shadow-sm" aria-label="Email Verified">
                      ✓ Verified
                    </div>
                  )}
                </div>

                <div className={`transition-all duration-300 ease-out overflow-hidden px-1.5 md:px-2 ${otpStatus === 'sent' || otpStatus === 'verifying' ? 'max-h-24 opacity-100 pb-1.5 pt-1 mt-1' : 'max-h-0 opacity-0 pb-0 pt-0 mt-0'}`}>
                  <div className="flex gap-2 md:gap-3 relative z-10">
                    <label htmlFor="otpCode" className="sr-only">OTP Code</label>
                    <input 
                      id="otpCode"
                      type="text" 
                      placeholder="6-digit OTP" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 bg-white/80 border border-white focus:border-[#5227FF] focus:ring-2 focus:ring-[#5227FF]/30 rounded-lg md:rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm text-center tracking-[0.3em] md:tracking-[0.5em] text-slate-900 font-extrabold outline-none shadow-inner"
                    />
                    <button 
                      onClick={handleVerifyOTP}
                      disabled={otpCode.length < 4 || otpStatus === 'verifying'}
                      aria-busy={otpStatus === 'verifying'}
                      className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs px-5 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md flex items-center justify-center min-w-[100px] md:min-w-[120px] focus-visible:ring-4 focus-visible:ring-slate-900/40 outline-none"
                    >
                      {otpStatus === 'verifying' ? <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="message" className="sr-only">Project Details</label>
                <textarea 
                  id="message"
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={230} // Added strict character limit physically
                  placeholder="Tell us about your project... (Max 230 characters)" 
                  className="w-full bg-white/80 backdrop-blur-md text-slate-900 placeholder-slate-600 text-sm md:text-base font-medium rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 outline-none border border-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] focus:bg-white focus:shadow-[0_8px_25px_rgba(180,151,207,0.4)] focus:border-[#B497CF] transition-all duration-300 resize-none pb-8 md:pb-10 focus-visible:ring-4 focus-visible:ring-[#B497CF]/40"
                />
                {/* Updated visual character counter */}
                <div className={`absolute bottom-3 right-4 md:bottom-4 md:right-5 text-[10px] md:text-[11px] font-extrabold bg-white/80 px-2 py-0.5 rounded-full shadow-sm ${formData.message.length >= 230 ? 'text-red-500' : 'text-slate-500'}`} aria-live="polite">
                  {formData.message.length} / 230
                </div>
              </div>

              <button 
                type="submit" 
                disabled={otpStatus !== 'verified' || isSubmitting}
                aria-disabled={otpStatus !== 'verified' || isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 transition-all duration-300 group relative overflow-hidden rounded-xl md:rounded-2xl focus-visible:ring-4 focus-visible:ring-slate-900/40 outline-none
                  ${otpStatus === 'verified' 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.3)] hover:shadow-[0_15px_40px_rgba(15,23,42,0.4)] hover:scale-[1.02] border border-slate-700' 
                    : 'bg-white/60 text-slate-500 cursor-not-allowed border border-white backdrop-blur-md shadow-sm'
                  }
                `}
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                {otpStatus === 'verified' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
                )}
                
                <span className={`relative z-10 transition-all ${otpStatus === 'verified' ? "font-['Familjen_Grotesk'] font-black tracking-widest uppercase text-base md:text-xl" : "font-bold text-sm md:text-base"}`}>
                  {isSubmitting ? 'Submitting...' : 'Book Now'}
                </span>
                
                {otpStatus === 'verified' && !isSubmitting && (
                  <span aria-hidden="true" className="relative z-10 ml-2 text-xl md:text-2xl animate-bounce-horizontal">→</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}