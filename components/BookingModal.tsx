"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Stepper, { Step } from '../effects/Stepper';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    packageType: '',
    email: '',
    message: ''
  });
  
  // Stepper & Form State
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const MAX_CHARS = 230;

  // OTP State
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [actualOtp, setActualOtp] = useState('');

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation Logic
  const isStep1Valid = formData.name.trim() !== '' && formData.phone.trim() !== '' && otpStatus === 'verified';
  const isStep2Valid = formData.packageType !== '';

  const getIsNextDisabled = () => {
    if (activeStep === 1) return !isStep1Valid;
    if (activeStep === 2) return !isStep2Valid;
    if (activeStep === 3) return isSubmitting;
    return false;
  };

  // OTP Logic
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

  // Final Submission Logic
  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "booking_requests"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new"
      });

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID!, 
        {
          to_email: 'qurevotechnologies@gmail.com', 
          from_name: formData.name,
          phone: formData.phone,
          package: formData.packageType,
          message: formData.message || 'No message provided.',
          reply_to: formData.email
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFormData({ name: '', phone: '', packageType: '', email: '', message: '' });
    setOtpStatus('idle');
    setOtpCode('');
    setActualOtp('');
    setActiveStep(1);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
        
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />

      {/* Modal Container: Highly flexible width/height with safe limits */}
      <div className="relative w-full max-w-[95%] sm:max-w-md bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10">
        
        {/* FIXED Header area (Never scrolls away) */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center">
            {/* Image untouched exactly as requested */}
            <Image src="/icons/fulllogo.png" alt="Qurevo Logo" width={1056} height={733} className="h-20 sm:h-20 w-auto object-contain" />
          </div>
          <button onClick={resetAndClose} className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* SCROLLABLE Body area */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 pb-8 scrollbar-hide">
          {isSuccess ? (
            /* Success State */
            <div className="text-center flex flex-col items-center justify-center h-full py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h3>
              <p className="text-sm text-slate-600 mb-8 px-4">Our team will contact you shortly to discuss your digital transformation.</p>
              <button onClick={resetAndClose} className="bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-colors w-full sm:w-auto text-sm">
                Close Window
              </button>
            </div>
          ) : (
            /* Stepper Form */
            <Stepper
              onStepChange={(step) => setActiveStep(step)}
              onFinalStepCompleted={handleComplete}
              nextButtonProps={{
                disabled: getIsNextDisabled(),
              }}
            >
              {/* STEP 1: Personal Details & OTP */}
              <Step>
                <div className="pb-2">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">Let's get started</h2>
                  <p className="text-xs text-slate-500 mb-6">We need your basic details to verify your identity.</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Full Name *</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="John Doe" required />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Phone *</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="+91..." required />
                      </div>
                    </div>

                    {/* OTP Email Section */}
                    <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden transition-all duration-500">
                      {otpStatus === 'verified' && <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />}
                      
                      <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          disabled={otpStatus === 'verified'}
                          required
                          placeholder="Your Email Address *" 
                          className="flex-1 bg-white border border-slate-200 px-4 py-2.5 sm:py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-blue-200 rounded-xl"
                        />
                        
                        {otpStatus !== 'verified' && (
                          <button 
                            onClick={handleSendOTP}
                            disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center min-w-[100px] outline-none"
                          >
                            {otpStatus === 'sending' ? 'Sending...' : otpStatus === 'sent' ? 'Resend' : 'Send OTP'}
                          </button>
                        )}
                        
                        {otpStatus === 'verified' && (
                          <div className="flex items-center justify-center px-5 py-3 rounded-xl bg-green-100 text-green-800 font-extrabold text-xs border border-green-200">
                            ✓ Verified
                          </div>
                        )}
                      </div>

                      {/* OTP Code Entry Input - Using Grid for 100% accurate height calculation to stop clipping */}
                      <div className={`grid transition-all duration-300 ease-in-out ${otpStatus === 'sent' || otpStatus === 'verifying' ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                          <div className="flex gap-2 relative z-10 pt-1 pb-1">
                            <input 
                              type="text" 
                              placeholder="6-digit OTP" 
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="flex-1 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-center tracking-[0.3em] text-slate-900 font-extrabold outline-none"
                            />
                            <button 
                              onClick={handleVerifyOTP}
                              disabled={otpCode.length < 4 || otpStatus === 'verifying'}
                              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center min-w-[100px] outline-none"
                            >
                              {otpStatus === 'verifying' ? '...' : 'Verify'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Step>

              {/* STEP 2: Service / Package Selection */}
              <Step>
                <div className="pb-2">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">What do you need?</h2>
                  <p className="text-xs text-slate-500 mb-6">Select the package or service you are looking for.</p>
                  
                  <div className="space-y-3">
                    {[
                      'Starter Package — ₹10,000', 
                      'Growth Package — ₹15,000', 
                      'Premium Package — ₹20,000', 
                      'Custom Requirements / Quote'
                    ].map((pkg) => (
                      <label key={pkg} className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${formData.packageType === pkg ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                        <input 
                          type="radio" 
                          name="package" 
                          value={pkg} 
                          checked={formData.packageType === pkg} 
                          onChange={e => setFormData({...formData, packageType: e.target.value})} 
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                        />
                        <span className="ml-3 text-sm font-bold text-slate-800">{pkg}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Step>

              {/* STEP 3: Message & Submit */}
              <Step>
                <div className="pb-2">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">Any specific details?</h2>
                  <p className="text-xs text-slate-500 mb-6">Briefly describe your project. We'll handle the rest.</p>
                  
                  <div className="relative pb-2">
                    <textarea 
                      value={formData.message} 
                      onChange={e => {
                        if (e.target.value.length <= MAX_CHARS) {
                          setFormData({...formData, message: e.target.value});
                        }
                      }} 
                      rows={5}
                      maxLength={MAX_CHARS}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none pb-8" 
                      placeholder="I am looking to build a website that..."
                    />
                    <div className={`absolute bottom-5 right-4 text-[10px] font-bold ${formData.message.length >= MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.message.length} / {MAX_CHARS}
                    </div>
                  </div>
                  
                  {isSubmitting && (
                    <div className="mt-3 text-center text-xs font-bold text-blue-600 animate-pulse">
                      Processing your request securely...
                    </div>
                  )}
                </div>
              </Step>
            </Stepper>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}