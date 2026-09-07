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

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
    if (otpCode.length === 6 && otpStatus === 'sent') {
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
    }
  }, [otpCode, otpStatus, actualOtp]);

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
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      return alert("Please enter your Full Name and Phone number before sending the OTP.");
    }
    if (!formData.email.trim()) return alert("Please enter your email first.");
    
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
    
    let firebaseSuccess = false;
    let emailSuccess = false;

    // 1. Attempt to save to Firebase safely
    try {
      await addDoc(collection(db, "booking_requests"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new"
      });
      firebaseSuccess = true;
    } catch (dbError) {
      // If Firebase fails, we log it, but it WON'T stop the email from sending
      console.error("Firebase Error (Check Firestore rules or env config):", dbError);
    }

    // 2. Attempt to send Admin Email safely
    try {
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
      emailSuccess = true;
    } catch (emailError) {
      console.error("EmailJS Error:", emailError);
    }

    setIsSubmitting(false);

    // 3. Determine Success State
    if (firebaseSuccess || emailSuccess) {
      // If AT LEAST ONE worked, show the success screen to the user
      setIsSuccess(true); 
    } else {
      // If BOTH failed, show an error
      alert("Submission failed. Please check your browser console for errors and try again.");
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

      {/* Modal Container */}
      <div className="relative w-full max-w-[95%] sm:max-w-md bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden z-10">
        
        {/* Header area */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center">
            <Image src="/icons/fulllogo.png" alt="Qurevo Logo" width={1056} height={733} className="h-10 sm:h-22 w-auto object-contain" />
          </div>
          <button type="button" onClick={resetAndClose} aria-label="Close" className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Body area */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6 pb-10 scrollbar-hide">
          {isSuccess ? (
            /* Success State with Celebration Animation */
            <div className="text-center flex flex-col items-center justify-center h-full py-6">
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-4 text-yellow-400 sparkle-1 text-xl">✨</div>
                <div className="absolute -top-5 right-[-10px] text-yellow-400 sparkle-2 text-2xl">✨</div>
                <div className="absolute top-6 -right-6 text-yellow-400 sparkle-3 text-lg">✨</div>
                
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center animate-success-pop shadow-[0_0_25px_rgba(16,185,129,0.4)] relative z-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
                Request Sent!
              </h3>
              <p className="text-sm text-slate-600 mb-6 px-2 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
                Our team will contact you shortly to discuss your digital transformation.
              </p>
              <button 
                type="button" 
                onClick={resetAndClose} 
                className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-full hover:bg-slate-800 transition-colors w-full sm:w-auto text-base sm:text-sm animate-fade-in-up"
                style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}
              >
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
                <div className="pb-24 sm:pb-20">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Let's get started</h2>
                  <p className="text-xs text-slate-500 mb-4">We need your basic details to verify your identity.</p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">Full Name *</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="John Doe" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">Phone *</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="+91..." required />
                      </div>
                    </div>

                    {/* OTP Email Section */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden transition-all duration-500">
                      {otpStatus === 'verified' && <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />}
                      
                      <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          disabled={otpStatus === 'verified'}
                          required
                          placeholder="Your Email Address *" 
                          className="flex-1 bg-white border border-slate-200 px-3 py-2.5 sm:py-2 text-base sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-blue-200 rounded-lg"
                        />
                        
                        {otpStatus !== 'verified' && (
                          <button 
                            type="button"
                            onClick={handleSendOTP}
                            disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] sm:text-xs px-4 py-2.5 sm:py-2 rounded-lg transition-all shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[90px] outline-none"
                          >
                            {otpStatus === 'sending' ? 'Sending...' : otpStatus === 'sent' ? 'Resend' : 'Send OTP'}
                          </button>
                        )}
                        
                        {otpStatus === 'verified' && (
                          <div className="flex items-center justify-center px-4 py-2.5 sm:py-2 rounded-lg bg-green-100 text-green-800 font-extrabold text-[13px] sm:text-xs border border-green-200">
                            ✓ Verified
                          </div>
                        )}
                      </div>

                      {/* OTP Code Entry */}
                      {otpStatus !== 'verified' && (
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${otpStatus === 'sent' || otpStatus === 'verifying' ? 'max-h-[100px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                          <div className="flex gap-2 relative z-10 pt-1 pb-1">
                            <input 
                              type="text" 
                              placeholder="6-digit OTP" 
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="flex-1 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm text-center tracking-[0.2em] sm:tracking-[0.3em] text-slate-900 font-extrabold outline-none"
                            />
                            <button 
                              type="button"
                              onClick={handleVerifyOTP}
                              disabled={otpCode.length < 4 || otpStatus === 'verifying'}
                              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-[13px] sm:text-xs px-4 py-2.5 sm:py-2 rounded-lg transition-all shadow-sm flex items-center justify-center min-w-[90px] outline-none"
                            >
                              {otpStatus === 'verifying' ? '...' : 'Verify'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Step>

              {/* STEP 2: Service / Package Selection */}
              <Step>
                <div className="pb-24 sm:pb-20">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">What do you need?</h2>
                  <p className="text-xs text-slate-500 mb-4">Select the package or service you are looking for.</p>
                  
                  <div className="space-y-2.5">
                    {[
                      'Starter Package — ₹10,000', 
                      'Growth Package — ₹15,000', 
                      'Premium Package — ₹20,000', 
                      'Custom Requirements / Quote'
                    ].map((pkg) => (
                      <label key={pkg} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.packageType === pkg ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
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
                <div className="pb-24 sm:pb-20">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Any specific details?</h2>
                  <p className="text-xs text-slate-500 mb-4">Briefly describe your project. We'll handle the rest.</p>
                  
                  <div className="relative pb-2">
                    <textarea 
                      value={formData.message} 
                      onChange={e => {
                        if (e.target.value.length <= MAX_CHARS) {
                          setFormData({...formData, message: e.target.value});
                        }
                      }} 
                      rows={4}
                      maxLength={MAX_CHARS}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-base sm:text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none pb-8" 
                      placeholder="I am looking to build a website that..."
                    />
                    <div className={`absolute bottom-5 right-3 text-[10px] font-bold ${formData.message.length >= MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.message.length} / {MAX_CHARS}
                    </div>
                  </div>
                  
                  {isSubmitting && (
                    <div className="mt-2 text-center text-xs font-bold text-blue-600 animate-pulse">
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

        /* Celebration Animations */
        @keyframes successPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkleFloat {
          0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; transform: scale(1) rotate(15deg); }
          100% { transform: translateY(-25px) scale(0) rotate(30deg); opacity: 0; }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-success-pop {
          animation: successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .sparkle-1 { animation: sparkleFloat 1.2s ease-in-out forwards; animation-delay: 0.1s; }
        .sparkle-2 { animation: sparkleFloat 1.2s ease-in-out forwards; animation-delay: 0.3s; }
        .sparkle-3 { animation: sparkleFloat 1.2s ease-in-out forwards; animation-delay: 0.45s; }
      `}} />
    </div>
  );
} 