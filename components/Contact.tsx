"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

  // Listen for package preselection from Pricing component
  useEffect(() => {
    const handlePreselect = (e: any) => {
      setFormData(prev => ({ ...prev, packageType: e.detail }));
      setPulseHighlight(true);
      setTimeout(() => setPulseHighlight(false), 2500);
    };
    
    window.addEventListener('preselectPackage', handlePreselect);
    return () => window.removeEventListener('preselectPackage', handlePreselect);
  }, []);

  // Calculate filled fields for background animation and bucket progress
  const filledFields = useMemo(() => {
    let count = 0;
    if (formData.name.trim().length > 0) count++;
    if (formData.phone.trim().length > 0) count++;
    if (formData.packageType !== '') count++;
    if (otpStatus === 'verified') count++;
    if (formData.message.trim().length > 0) count++;
    return count;
  }, [formData, otpStatus]);

  const wordCount = useMemo(() => {
    return formData.message.trim().split(/\s+/).filter(Boolean).length;
  }, [formData.message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 40 && value.length > formData.message.length) return; 
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
    <section id="book" className="pt-24 pb-12 bg-slate-50 overflow-hidden flex flex-col relative z-0">
      
      {/* Page Ambient Glow */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />

      <div className="max-w-[96rem] mx-auto px-4 sm:px-8 w-full relative z-10">
        
        {/* ============================================================== */}
        {/* PREMIUM CONTAINER (The Whole Window acts as a unified element) */}
        {/* ============================================================== */}
        <div className="relative rounded-[3rem] p-8 md:p-14 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white/60 bg-white/40 backdrop-blur-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Animated Background Mesh Inside the Container */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[3rem]">
            {/* Base layer */}
            <div className="absolute inset-0 bg-white/20 transition-opacity duration-1000" />
            
            {/* Smooth shifting color orbs that intensify based on progress */}
            <div className={`absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#bff0f5]/80 to-transparent blur-[80px] transition-all duration-[2000ms] ease-in-out ${filledFields >= 1 ? 'opacity-100 scale-110 translate-x-10' : 'opacity-40 scale-100'}`} />
            <div className={`absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#e0a6f7]/60 to-transparent blur-[80px] transition-all duration-[2000ms] ease-in-out ${filledFields >= 2 ? 'opacity-100 scale-125 -translate-y-10' : 'opacity-0 scale-90'}`} />
            <div className={`absolute top-[30%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#a6f7d0]/60 to-transparent blur-[80px] transition-all duration-[2000ms] ease-in-out ${filledFields >= 3 ? 'opacity-100 scale-110 translate-x-10' : 'opacity-0 scale-50'}`} />
            <div className={`absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#bff0f5]/30 transition-opacity duration-1000 ${filledFields >= 4 ? 'opacity-100' : 'opacity-0'}`} />
          </div>


          {/* --- Left Column: Branding & Fluid Bucket --- */}
          <div className="lg:col-span-5 flex flex-col relative z-10 h-full justify-between">
            
            <div className="flex items-start justify-between">
              <div>
                <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-8 flex items-center justify-center border border-slate-100 transform hover:scale-105 transition-transform duration-500">
                  <Image src="/logo.png" alt="H Studios Branding Icon" width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 drop-shadow-sm">Book Website <br/>Window</h3>
                <p className="text-base text-slate-600 leading-relaxed font-medium max-w-sm drop-shadow-sm">
                  Ready to elevate your brand? Complete the details to lock in your project. We use secure verification to guarantee priority support.
                </p>
              </div>

              {/* Realistic Fluid Bucket Animation */}
              <div className="hidden md:flex flex-col items-center mt-4">
                <div className="relative w-16 h-32 border-4 border-white bg-white/20 backdrop-blur-md rounded-b-2xl rounded-t-sm shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_-10px_20px_rgba(255,255,255,0.8)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white z-20" />
                  <div 
                    className="absolute bottom-0 left-0 right-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] z-10"
                    style={{ height: `${(filledFields / 5) * 100}%` }}
                  >
                    {/* Simulated Liquid Waves */}
                    <div className="absolute top-[-8px] left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-[#bff0f5] to-[#a6f7d0] rounded-[45%] animate-spin" style={{ animationDuration: '4s' }} />
                    <div className="absolute top-[-5px] left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-[#e0a6f7] to-[#bff0f5] rounded-[40%] animate-spin opacity-80" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-500 mt-3 tracking-widest uppercase">Progress</span>
              </div>
            </div>

            <div className="pt-8 mt-12 border-t border-slate-200/40">
              <div className="flex items-center space-x-4 text-sm text-slate-800 font-bold mb-5">
                <span className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-500 border border-slate-50">✓</span>
                <span className="drop-shadow-sm">Secure OTP Verification</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-800 font-bold">
                <span className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-teal-500 border border-slate-50">⚡</span>
                <span className="drop-shadow-sm">Lightning Fast Response</span>
              </div>
            </div>
          </div>

          {/* --- Right Column: The "Exceptions" (Inputs) --- */}
          {/* We make the inputs solid white with elegant shadows so they pop out from the container */}
          <div className="lg:col-span-7 relative z-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Full Name" 
                  className="w-full bg-white text-slate-900 placeholder-slate-400 font-medium rounded-2xl px-5 py-4 outline-none border border-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_25px_rgba(166,247,208,0.5)] focus:border-[#a6f7d0] transition-all duration-300"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number" 
                  className="w-full bg-white text-slate-900 placeholder-slate-400 font-medium rounded-2xl px-5 py-4 outline-none border border-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_25px_rgba(166,247,208,0.5)] focus:border-[#a6f7d0] transition-all duration-300"
                />
              </div>

              {/* Package Dropdown */}
              <div className="relative">
                <select 
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                  required
                  className={`w-full appearance-none cursor-pointer rounded-2xl px-5 py-4 font-bold outline-none border transition-all duration-300
                    ${pulseHighlight 
                      ? 'bg-white shadow-[0_8px_25px_rgba(224,166,247,0.5)] border-[#e0a6f7] text-blue-600 scale-[1.01]' 
                      : 'bg-white text-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border-white focus:shadow-[0_8px_25px_rgba(224,166,247,0.5)] focus:border-[#e0a6f7]'
                    }
                  `}
                >
                  <option value="" disabled>Select a Package...</option>
                  <option value="Starter - ₹10,000">Starter Package — ₹10,000</option>
                  <option value="Growth - ₹15,000">Growth Package — ₹15,000</option>
                  <option value="Premium - ₹20,000">Premium Package — ₹20,000</option>
                  <option value="Custom Quote">Custom Requirements / Quote</option>
                </select>
                <div className={`absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors font-bold ${pulseHighlight ? 'text-blue-600' : 'text-slate-400'}`}>▼</div>
              </div>

              {/* Email & Fast OTP Block */}
              <div className="p-2 rounded-[1.25rem] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-500">
                {otpStatus === 'verified' && <div className="absolute inset-0 bg-[#a6f7d0]/10 pointer-events-none" />}
                
                <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={otpStatus === 'verified'}
                    required
                    placeholder="Your Email Address" 
                    className="flex-1 bg-transparent px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all disabled:opacity-60"
                  />
                  
                  {otpStatus !== 'verified' && (
                    <button 
                      onClick={handleSendOTP}
                      disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                      className="whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    >
                      {otpStatus === 'sending' ? (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : otpStatus === 'sent' ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                  
                  {otpStatus === 'verified' && (
                    <div className="flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#a6f7d0]/30 text-teal-800 font-extrabold text-xs border border-[#a6f7d0]/50 shadow-sm">
                      ✓ Verified
                    </div>
                  )}
                </div>

                <div className={`transition-all duration-300 ease-out overflow-hidden px-2 ${otpStatus === 'sent' || otpStatus === 'verifying' ? 'max-h-20 opacity-100 pb-2 pt-1 mt-1' : 'max-h-0 opacity-0 pb-0 pt-0 mt-0'}`}>
                  <div className="flex gap-3 relative z-10">
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 bg-slate-50 border border-slate-100 focus:border-[#e0a6f7] focus:ring-2 focus:ring-[#e0a6f7]/30 rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] text-slate-900 font-extrabold outline-none shadow-inner"
                    />
                    <button 
                      onClick={handleVerifyOTP}
                      disabled={otpCode.length < 4 || otpStatus === 'verifying'}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center min-w-[120px]"
                    >
                      {otpStatus === 'verifying' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Block */}
              <div className="relative">
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project... (Max 40 words)" 
                  className="w-full bg-white text-slate-900 placeholder-slate-400 font-medium rounded-2xl px-5 py-4 outline-none border border-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_25px_rgba(191,240,245,0.6)] focus:border-[#bff0f5] transition-all duration-300 resize-none pb-10"
                />
                <div className={`absolute bottom-4 right-5 text-[11px] font-extrabold bg-white px-2 py-0.5 rounded-full shadow-sm ${wordCount >= 40 ? 'text-red-500' : 'text-slate-400'}`}>
                  {wordCount} / 40
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={otpStatus !== 'verified' || isSubmitting}
                className={`w-full font-black text-sm px-6 py-4.5 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-xl ${
                  otpStatus === 'verified' 
                    ? 'bg-slate-900 text-white hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-900/20' 
                    : 'bg-white/60 text-slate-400 cursor-not-allowed border border-white backdrop-blur-md'
                }`}
                style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
              >
                <span>{isSubmitting ? 'Submitting Request...' : 'Book Now'}</span>
                {otpStatus === 'verified' && !isSubmitting && <span aria-hidden="true" className="ml-1">→</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}