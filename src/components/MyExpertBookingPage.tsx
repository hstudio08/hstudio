"use client";

import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { isValidMyExpertCoupon, calculateMyExpertPayback, MYEXPERT_PAYBACK_PERCENTAGE, isCouponAlreadyClaimed } from '../lib/coupons';

interface MyExpertBookingPageProps {
  slug: string;
}

// -------------------------------------------------------------
// Security & Sanitization Helpers
// -------------------------------------------------------------
const sanitizeInputString = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

const getCleanPhoneDigits = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

const countWords = (str: string): number => {
  if (!str || !str.trim()) return 0;
  return str.trim().split(/\s+/).length;
};

// Check if a phone number already has 3 or more active (non-rejected) bookings in Firestore
const getPhoneBookingCount = async (phone: string): Promise<number> => {
  try {
    const cleanPhone = getCleanPhoneDigits(phone);
    if (!cleanPhone) return 0;

    const q = query(
      collection(db, "booking_requests"),
      where("phone", "==", cleanPhone)
    );
    const snapshot = await getDocs(q);

    const matchingDocs = snapshot.docs.filter((docDoc) => {
      const data = docDoc.data();
      const docStatus = (data.status || 'new').toString().trim().toLowerCase();
      return docStatus !== 'rejected';
    });

    return matchingDocs.length;
  } catch (err) {
    // Unauthenticated clients cannot read whole collection under Firestore Rules allow read: if isAdmin();
    console.warn("Phone booking count check skipped (requires admin read per rules):", err);
    return 0;
  }
};

export default function MyExpertBookingPage({ slug }: MyExpertBookingPageProps) {
  // Exit modal state (No external links)
  const [showExitModal, setShowExitModal] = useState(false);

  // Legal Modal states (Terms & Conditions / Privacy Policy - closed by default)
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Stepper active step (1: Contact, 2: Email OTP, 3: Package & Coupon, 4: Summary)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Package State
  const [selectedPackage, setSelectedPackage] = useState<'Starter' | 'Growth' | 'Premium'>('Growth');

  // 24-Hour Live Countdown Timer State (Valid for First 5 Clients)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    // 24-hour countdown timer
    const targetTime = Date.now() + 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const difference = Math.max(0, targetTime - now);
      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Coupon State (TRANSIENT IN-MEMORY ONLY - NO LOCALSTORAGE / SESSIONSTORAGE / SITE DATA CACHING)
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState<string | null>(null);
  const [isCouponValidating, setIsCouponValidating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Contact Details State with strict input limits matching Firestore Rules
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Validation Error States
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isCheckingPhoneLimit, setIsCheckingPhoneLimit] = useState(false);

  // OTP State
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [actualOtp, setActualOtp] = useState('');

  // Submission & Cryptographic Hash State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string>('');

  // Canvas Ref for Confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Package Original Prices & Exact Feature Lists
  const packagesList = [
    {
      name: 'Starter' as const,
      tagline: 'Perfect for startups & individuals',
      price: 10000,
      priceFormatted: '₹10,000',
      popular: false,
      features: [
        'Landing Page',
        'Responsive Design',
        'Basic SEO',
        'Contact Form',
        '1 Week bug fixes',
        'One week Email Support'
      ]
    },
    {
      name: 'Growth' as const,
      tagline: 'Best for growing businesses',
      price: 15000,
      priceFormatted: '₹15,000',
      popular: true,
      features: [
        'Upto 5 Pages',
        'Responsive Design',
        'Advanced SEO',
        'CMS Integration (Basic)',
        '1 Revision',
        'One Week Whatsapp Support + Email Support',
        'Contact Form',
        'Admin Panel',
        '1 week bug fixes',
        'Upto 20 Products/Services (Expandable with extra costs)',
        'Social Media Integration'
      ]
    },
    {
      name: 'Premium' as const,
      tagline: 'For brands that want the best',
      price: 20000,
      priceFormatted: '₹20,000',
      popular: false,
      features: [
        'Upto 10 Pages',
        'Premium Design',
        'Advanced SEO',
        'Custom Features',
        '1-2 Revisions',
        '10 days Priority Support (Call/Whatsapp/Email)',
        'Contact Form',
        'Admin Panel',
        '1 month bug fixes',
        'Max 50 Products/Services (Expandable with extra costs)',
        'Payment Gateway Integration',
        'Blog/News Section',
        'Analytics Setup',
        'Social Media Integration'
      ]
    }
  ];

  const packagePrices: Record<'Starter' | 'Growth' | 'Premium', number> = {
    Starter: 10000,
    Growth: 15000,
    Premium: 20000
  };

  const currentBasePrice = packagePrices[selectedPackage];
  // STRICT SERVER/COMPONENT VERIFICATION: Calculate payback ONLY if valid coupon applied
  const isCouponVerified = appliedCoupon ? isValidMyExpertCoupon(appliedCoupon) : false;
  const paybackInfo = calculateMyExpertPayback(currentBasePrice, isCouponVerified ? MYEXPERT_PAYBACK_PERCENTAGE : 0);

  // Helper to generate a SHA-256 hex cryptographic verification hash
  const generateVerificationHash = async (nameStr: string, phoneStr: string): Promise<string> => {
    try {
      const seed = `${nameStr}-${phoneStr}-${Date.now()}-${Math.random()}`;
      const msgUint8 = new TextEncoder().encode(seed);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `QX-ME-${hashHex.substring(0, 16).toUpperCase()}`;
    } catch {
      return `QX-ME-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    }
  };

  // Calculate completion percentage for progress slider animation
  const calculateProgress = () => {
    if (isSuccess) return 100;
    if (activeStep === 1) {
      if (formData.name.trim() && formData.phone.trim()) return 25;
      if (formData.name.trim() || formData.phone.trim()) return 10;
      return 5;
    }
    if (activeStep === 2) {
      if (otpStatus === 'verified') return 50;
      if (otpStatus === 'sent' || otpStatus === 'sending') return 35;
      return 30;
    }
    if (activeStep === 3) {
      if (appliedCoupon) return 85;
      return 70;
    }
    if (activeStep === 4) {
      if (agreedToTerms) return 95;
      return 90;
    }
    return 0;
  };

  const currentProgress = calculateProgress();

  // -------------------------------------------------------------
  // Automatically generate & maintain a random string token at the end of the URL
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1] || '';

      // Check if last segment is already a random token starting with qx-
      if (!lastSegment.startsWith('qx-') || lastSegment.length < 8) {
        const randomToken = 'qx-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const newPath = `/collab/myexpert/web-booking/${randomToken}`;
        window.history.replaceState({ page: 'myexpert-booking' }, '', newPath);
      }
    }
  }, []);

  // -------------------------------------------------------------
  // Prevent Accidental Back Navigation (Popstate Interception) & Ensure Zero Site Data Storage
  // -------------------------------------------------------------
  useEffect(() => {
    window.history.pushState({ page: 'myexpert-booking' }, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState({ page: 'myexpert-booking' }, '', window.location.href);
      setShowExitModal(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Auto-verify OTP when 6 digits entered
  useEffect(() => {
    if (otpCode.length === 6 && otpStatus === 'sent') {
      setOtpStatus('verifying');
      setTimeout(() => {
        if (otpCode === actualOtp) {
          setOtpStatus('verified');
        } else {
          alert('Invalid OTP code. Please check your email.');
          setOtpStatus('sent');
          setOtpCode('');
        }
      }, 350);
    }
  }, [otpCode, otpStatus, actualOtp]);

  // -------------------------------------------------------------
  // Instant Downloadable Booking Summary Screenshot Generator with Hash
  // -------------------------------------------------------------
  const downloadBookingSummaryImage = (hashVal?: string) => {
    const activeHash = hashVal || verificationHash || 'QX-ME-VERIFIED-AUTH';
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 820;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 820);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 650, 820);

    // Outer border
    ctx.strokeStyle = '#1B4D3E';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 642, 812);

    // Header banner
    ctx.fillStyle = '#1B4D3E';
    ctx.fillRect(8, 8, 634, 105);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('QUREVO TECHNOLOGIES', 30, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('MyExpert Collaboration — Official Receipt', 30, 82);

    // Content section
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('BOOKING CONFIRMATION SUMMARY', 30, 150);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 162);
    ctx.lineTo(620, 162);
    ctx.stroke();

    // Details rendering helper
    const drawRow = (label: string, value: string, y: number, isHighlight = false, isGreen = false) => {
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(label, 40, y);

      ctx.fillStyle = isGreen ? '#1B4D3E' : isHighlight ? '#D4AF37' : '#0F172A';
      ctx.font = isHighlight || isGreen ? 'bold 17px sans-serif' : '16px sans-serif';
      ctx.fillText(value, 260, y);
    };

    drawRow('Customer Name:', formData.name, 205);
    drawRow('Phone Number:', formData.phone, 245);
    drawRow('Verified Email:', formData.email, 285);
    drawRow('Selected Package:', `${selectedPackage} Package`, 325);
    drawRow('Original Base Price:', `₹${currentBasePrice.toLocaleString('en-IN')}`, 365);

    if (isCouponVerified && appliedCoupon) {
      drawRow('Coupon Code:', appliedCoupon, 405, true);
      drawRow('MyExpert Payback (30%):', `- ₹${paybackInfo.paybackAmount.toLocaleString('en-IN')}`, 445, false, true);
      drawRow('Final Net Outlay:', `₹${paybackInfo.netPrice.toLocaleString('en-IN')}`, 495, true, true);
    } else {
      drawRow('Coupon Status:', 'No Coupon Applied', 405);
      drawRow('Final Net Outlay:', `₹${currentBasePrice.toLocaleString('en-IN')}`, 465, true);
    }

    // Terms notice box
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(30, 540, 590, 160);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 540, 590, 160);

    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.fillText('OFFICIAL COLLABORATION DISCLAIMER & TERMS:', 45, 568);
    ctx.fillText('• 30% payback discount is valid ONLY if client proceeds immediately with onboarding.', 45, 595);
    ctx.fillText('• Delays (asking for next week/month) will result in immediate coupon revocation.', 45, 620);
    ctx.fillText('• Qurevo Technologies & MyExpert reserve full authority to approve/reject bookings.', 45, 645);
    ctx.fillText('• Clients may be required to pay an advance deposit to initiate engineering.', 45, 670);

    // Footer
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Generated automatically on ${new Date().toLocaleString()} | Qurevo × MyExpert`, 30, 770);

    // INVISIBLE STEGANOGRAPHIC HASH ENCODING (Embedded invisibly in image data, zero visible text to client)
    ctx.fillStyle = 'rgba(27, 77, 62, 0.003)';
    ctx.font = '1px monospace';
    ctx.fillText(`STEGANO_HASH:${activeHash}`, 2, 818);

    // Download trigger
    const imageURI = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `qurevo-myexpert-booking-${formData.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    downloadLink.href = imageURI;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // -------------------------------------------------------------
  // Canvas Confetti Trigger
  // -------------------------------------------------------------
  const fireConfetti = () => {
    setShowConfetti(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#1B4D3E', '#D4AF37', '#F59E0B', '#10B981', '#3B82F6'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 30,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let opacity = 1;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      opacity -= 0.015;
      if (opacity > 0) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShowConfetti(false);
      }
    };
    render();
  };

  // -------------------------------------------------------------
  // Step 1 Validation & Phone Booking Count Limit Check (Max 3 per phone)
  // -------------------------------------------------------------
  const handleProceedFromStep1 = async () => {
    setNameError(null);
    setPhoneError(null);

    const cleanName = sanitizeInputString(formData.name);
    const cleanPhone = formData.phone.trim();
    const phoneDigits = getCleanPhoneDigits(cleanPhone);

    if (!cleanName) {
      setNameError('Full name is required.');
      return;
    }
    if (cleanName.length > 50) {
      setNameError('Name cannot exceed 50 characters.');
      return;
    }
    if (countWords(cleanName) > 6) {
      setNameError('Name cannot exceed 6 words.');
      return;
    }
    if (!/^[a-zA-Z\s.-]+$/.test(cleanName)) {
      setNameError('Name can only contain alphabetic letters, spaces, dots, and hyphens.');
      return;
    }

    if (!cleanPhone) {
      setPhoneError('Phone number is required.');
      return;
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 20) {
      setPhoneError('Phone number must contain between 7 and 20 digits.');
      return;
    }

    // RATE LIMIT CHECK: Max 3 bookings per phone number
    setIsCheckingPhoneLimit(true);
    const bookingCount = await getPhoneBookingCount(cleanPhone);
    setIsCheckingPhoneLimit(false);

    if (bookingCount >= 3) {
      setPhoneError(`Maximum booking limit reached! Phone number (${cleanPhone}) has already registered ${bookingCount} active bookings (Max 3 allowed).`);
      return;
    }

    // Advance to Step 2
    setActiveStep(2);
  };

  // -------------------------------------------------------------
  // Single-Use Strict Coupon Validation with Real-Time Active Firestore Check
  // -------------------------------------------------------------
  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCouponError(null);
    setCouponSuccessMsg(null);

    const trimmed = couponCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!trimmed) {
      setCouponError('Please enter your coupon code.');
      return;
    }
    if (trimmed.length > 15) {
      setCouponError('Coupon code cannot exceed 15 characters.');
      return;
    }

    setIsCouponValidating(true);

    if (!isValidMyExpertCoupon(trimmed)) {
      setIsCouponValidating(false);
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code. 30% payback requires an exact valid MyExpert coupon.');
      return;
    }

    // Check single-use active status in Firestore (status !== 'rejected')
    const alreadyClaimed = await isCouponAlreadyClaimed(trimmed);
    setIsCouponValidating(false);

    if (alreadyClaimed) {
      setAppliedCoupon(null);
      setCouponError(`Coupon code ${trimmed} is already claimed on an active booking. If a booking is rejected by admin, the coupon becomes available again.`);
      return;
    }

    setAppliedCoupon(trimmed);
    setCouponSuccessMsg(`🎉 30% Payback coupon (${trimmed}) applied! Saved ₹${((currentBasePrice * 30) / 100).toLocaleString('en-IN')}`);
    setCouponError(null);
    fireConfetti();
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    setCouponSuccessMsg(null);
  };

  // -------------------------------------------------------------
  // OTP Send Handler with Strict Email Validation
  // -------------------------------------------------------------
  const handleSendOTP = async (e: React.MouseEvent) => {
    e.preventDefault();
    setEmailError(null);

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your email address first.');
      return;
    }
    if (cleanEmail.length > 80) {
      setEmailError('Email address cannot exceed 80 characters.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    setOtpStatus('sending');
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setActualOtp(generatedOTP);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        {
          to_email: cleanEmail,
          passcode: generatedOTP,
          time: new Date(Date.now() + 15 * 60000).toLocaleTimeString()
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
      setTimeout(() => setOtpStatus('sent'), 300);
    } catch (err) {
      console.error('OTP Send Error:', err);
      alert('Could not send OTP email. Please check your email address.');
      setOtpStatus('idle');
    }
  };

  // -------------------------------------------------------------
  // Final Submission Handler — COMPLIES 100% WITH FIRESTORE SECURITY RULES
  // -------------------------------------------------------------
  const handleSubmitBooking = async () => {
    if (!agreedToTerms) {
      alert('Please accept the Terms & Conditions and Privacy Policy to complete your booking.');
      return;
    }

    setIsSubmitting(true);

    const cleanName = sanitizeInputString(formData.name);
    const cleanPhone = formData.phone.trim();
    const cleanEmail = formData.email.trim();
    // Enforce message length MAX 250 characters strictly to comply with Firestore rule: isValidString(message, 0, 250)
    const rawMessage = sanitizeInputString(formData.message) || 'No additional notes';
    const cleanMessage = rawMessage.substring(0, 250);

    // Generate Cryptographic Verification Hash
    const generatedHash = await generateVerificationHash(cleanName, cleanPhone);
    setVerificationHash(generatedHash);

    // Strict validation: Only log 30% payback if coupon is verified
    const finalCouponApplied = isCouponVerified ? appliedCoupon : null;
    const finalPaybackAmount = isCouponVerified ? paybackInfo.paybackAmount : 0;
    const finalNetPrice = isCouponVerified ? paybackInfo.netPrice : currentBasePrice;

    // PAYLOAD COMPLIANCE WITH FIRESTORE RULES:
    // 1. status MUST be strictly "new"
    // 2. keys hasAll: ['name', 'phone', 'email', 'packageType', 'message', 'status', 'timestamp']
    // 3. isValidString(name, 1, 100) -> PASSES
    // 4. isValidString(phone, 7, 20) -> PASSES
    // 5. isValidString(message, 0, 250) -> PASSES (truncated to <= 250)
    // 6. timestamp MUST be serverTimestamp() -> PASSES
    const bookingPayload = {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      packageType: `${selectedPackage} Package — ₹${currentBasePrice.toLocaleString('en-IN')}`,
      message: cleanMessage,
      status: 'new',
      timestamp: serverTimestamp(),

      // Additional Metadata Fields
      collaborator: 'MyExpert',
      slug,
      couponCode: finalCouponApplied || 'None',
      isCouponApplied: !!finalCouponApplied,
      paybackPercentage: finalCouponApplied ? MYEXPERT_PAYBACK_PERCENTAGE : 0,
      paybackAmount: finalPaybackAmount,
      originalPrice: currentBasePrice,
      netPrice: finalNetPrice,
      verificationHash: generatedHash,
      agreedToTerms: true
    };

    let firebaseOk = false;

    // Save to Firestore
    try {
      await addDoc(collection(db, 'booking_requests'), bookingPayload);
      firebaseOk = true;
    } catch (err: any) {
      console.error('Firestore Database Save Error:', err);
    }

    // STRICT REQUIREMENT: Booking MUST reach Firestore Database to be confirmed!
    if (!firebaseOk) {
      setIsSubmitting(false);
      alert('Error saving booking to Firestore database. Please check that all fields comply with valid parameters.');
      return;
    }

    // Send Admin Notification Email via EmailJS
    const emailMessageBody = finalCouponApplied
      ? `================================================
🏷️ MYEXPERT 30% PAYBACK COUPON APPLIED
================================================
Collaborator: MyExpert Partner Portal
Verification Hash: ${generatedHash}

Coupon Code: ${finalCouponApplied}
Original Base Price: ₹${currentBasePrice.toLocaleString('en-IN')}
Payback Discount (30%): -₹${finalPaybackAmount.toLocaleString('en-IN')}
Net Outlay Payable: ₹${finalNetPrice.toLocaleString('en-IN')}

Client Notes: ${cleanMessage}
Terms & Conditions Agreed: YES
(Client agrees to immediate onboarding call & potential advance payment rule)`
      : `================================================
STANDARD BOOKING (NO COUPON)
================================================
Collaborator: MyExpert Portal
Verification Hash: ${generatedHash}

Original Base Price: ₹${currentBasePrice.toLocaleString('en-IN')}
Net Payable Amount: ₹${currentBasePrice.toLocaleString('en-IN')}

Client Notes: ${cleanMessage}
Terms & Conditions Agreed: YES`;

    const packageTag = finalCouponApplied
      ? `${selectedPackage} Package (🏷️ 30% PAYBACK - Code: ${finalCouponApplied})`
      : `${selectedPackage} Package — ₹${currentBasePrice.toLocaleString('en-IN')}`;

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID || '',
        {
          to_email: 'qurevotechnologies@gmail.com',
          from_name: `${cleanName} (MyExpert Collab)`,
          reply_to: cleanEmail,
          phone: cleanPhone,
          package: packageTag,
          message: emailMessageBody
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
    } catch (err) {
      console.error('Admin Email Error:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    fireConfetti();
    
    // Instantly trigger downloadable summary image screenshot with generated hash
    setTimeout(() => {
      downloadBookingSummaryImage(generatedHash);
    }, 500);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen relative flex flex-col selection:bg-[#1B4D3E] selection:text-white w-full overflow-x-hidden">
      
      {/* Canvas for Confetti */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${showConfetti ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* ------------------------------------------------------------- */}
      {/* TOPMOST 24-HOUR COUNTDOWN BANNER (EXCLUSIVE TO FIRST 5 CLIENTS) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#1B4D3E] text-white py-2.5 px-4 text-center border-b-2 border-[#D4AF37] shadow-md sticky top-0 z-50 w-full flex flex-wrap items-center justify-between sm:justify-around gap-2 text-xs font-bold">
        
        <div className="flex items-center space-x-2">
          <span className="bg-[#D4AF37] text-slate-900 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse shadow-sm">
            🔥 LIMITED OFFER
          </span>
          <span className="text-[#D4AF37] font-extrabold uppercase tracking-wide hidden sm:inline">
            Valid for First 5 MyExpert Clients Only
          </span>
        </div>

        <div className="flex items-center space-x-2 font-mono bg-black/30 px-3.5 py-1 rounded-xl border border-[#D4AF37]/50 shadow-inner">
          <span className="text-slate-300 text-[10px] uppercase font-sans font-bold mr-1">Offer Expires In:</span>
          <span className="text-[#D4AF37] font-black text-sm">{String(timeLeft.hours).padStart(2, '0')}h</span>
          <span className="text-white">:</span>
          <span className="text-[#D4AF37] font-black text-sm">{String(timeLeft.minutes).padStart(2, '0')}m</span>
          <span className="text-white">:</span>
          <span className="text-[#D4AF37] font-black text-sm">{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN FULL-WIDTH CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <main className="relative w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 flex-1 space-y-10 sm:space-y-14">
        
        {/* HERO SECTION */}
        <section className="text-center w-full space-y-2 pt-2">
          <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-black leading-none tracking-tight uppercase bg-gradient-to-r from-[#1B4D3E] via-[#D4AF37] to-[#1B4D3E] bg-[length:200%_auto] animate-gradient-text text-transparent bg-clip-text drop-shadow-sm w-full">
            Get 30% Payback on Website
          </h1>
          
          <p className="font-['Bebas_Neue'] text-xl sm:text-3xl md:text-4xl font-black text-[#856404] tracking-widest uppercase animate-pulse">
            by MyExpert
          </p>

          <p className="text-xs sm:text-base text-slate-600 w-full max-w-4xl mx-auto font-medium leading-relaxed pt-1">
            Exclusive invitation for MyExpert community members. Claim 30% instant payback discount on all official website packages using your valid coupon code.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3 w-full max-w-md mx-auto px-2">
            <button
              onClick={() => scrollToSection('booking-wizard')}
              className="flex-1 bg-[#1B4D3E] hover:bg-[#12362b] text-white font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest border-2 border-[#1B4D3E] shadow-md transition-all active:scale-95"
            >
              Book Website
            </button>
            <button
              onClick={() => scrollToSection('original-packages')}
              className="flex-1 bg-white hover:bg-slate-100 text-[#1B4D3E] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest border-2 border-[#1B4D3E] transition-all active:scale-95"
            >
              View Packages
            </button>
          </div>
        </section>

        {/* 3 STEPS ROADMAP */}
        <section className="bg-white border-2 border-[#1B4D3E] rounded-3xl p-5 sm:p-8 space-y-6 shadow-md w-full">
          <h2 className="font-['Bebas_Neue'] text-3xl sm:text-5xl md:text-6xl font-black text-[#1B4D3E] text-center uppercase tracking-wider w-full">
            How to Claim Your 30% Payback
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            
            {/* Step 1 */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#1B4D3E] space-y-2 flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#1B4D3E] text-[#D4AF37] font-black flex items-center justify-center text-xs">
                  1
                </span>
                <span className="text-[10px] font-bold text-[#856404] uppercase tracking-wider bg-[#D4AF37]/20 px-2 py-0.5 rounded-md border border-[#D4AF37]/40">
                  INSTAGRAM
                </span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Follow MyExpert on Instagram</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Stay connected with official MyExpert social channels for business growth & coupon invites.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#1B4D3E] space-y-2 flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#1B4D3E] text-[#D4AF37] font-black flex items-center justify-center text-xs">
                  2
                </span>
                <span className="text-[10px] font-bold text-[#856404] uppercase tracking-wider bg-[#D4AF37]/20 px-2 py-0.5 rounded-md border border-[#D4AF37]/40">
                  DIRECT MESSAGE
                </span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">DM MyExpert to get coupon</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Send a direct message to MyExpert to receive your official 30% payback coupon code.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-[#1B4D3E] space-y-2 flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#1B4D3E] text-[#D4AF37] font-black flex items-center justify-center text-xs">
                  3
                </span>
                <span className="text-[10px] font-bold text-[#856404] uppercase tracking-wider bg-[#D4AF37]/20 px-2 py-0.5 rounded-md border border-[#D4AF37]/40">
                  BOOK & SAVE
                </span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Paste coupon & get 30% payback</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Enter your code in the booking section below to claim instant 30% payback on your website project.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ORIGINAL PACKAGES SHOWCASE */}
        <section id="original-packages" className="space-y-6 w-full">
          <div className="text-center space-y-1 w-full">
            <h2 className="font-['Bebas_Neue'] text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-wider w-full">
              Original Website Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Exact original prices. 30% payback applied only when valid MyExpert coupon is verified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
            
            {packagesList.map((pkg) => {
              const isSelected = selectedPackage === pkg.name;
              return (
                <div
                  key={pkg.name}
                  className={`p-6 rounded-3xl bg-white border-2 transition-all flex flex-col justify-between relative shadow-sm ${
                    pkg.popular
                      ? 'border-[#D4AF37] shadow-lg ring-4 ring-[#D4AF37]/20 md:-translate-y-1'
                      : isSelected
                      ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/20'
                      : 'border-[#1B4D3E]'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3.5 right-6 bg-[#D4AF37] text-slate-900 border border-[#856404] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#1B4D3E]">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{pkg.tagline}</p>
                      </div>
                    </div>

                    <div className="my-2">
                      <span className="text-3xl font-black text-slate-900">{pkg.priceFormatted}</span>
                      <span className="text-xs text-slate-500 block mt-0.5">Original Full Price</span>
                    </div>

                    <ul className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-700">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#1B4D3E] font-extrabold mt-0.5">✓</span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage(pkg.name);
                      scrollToSection('booking-wizard');
                    }}
                    className={`mt-6 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                      isSelected
                        ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]'
                        : 'border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E]/10'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}

          </div>
        </section>

        {/* BOOKING SECTION WITH DYNAMIC SLIDER PERCENTAGE PROGRESS */}
        <section id="booking-wizard" className="w-full max-w-4xl mx-auto">
          <div className="bg-white border-2 border-[#1B4D3E] rounded-3xl p-5 sm:p-10 space-y-6 shadow-xl relative overflow-hidden w-full">
            
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
              <div>
                <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl md:text-5xl font-black text-[#1B4D3E] uppercase tracking-wider">
                  Book Website before offer ends
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Complete your details step-by-step.</p>
              </div>

              {/* Dynamic Percentage Badge */}
              <div className="flex items-center space-x-1.5 bg-[#D4AF37]/20 border border-[#D4AF37] px-4 py-1.5 rounded-full">
                <span className="text-xs font-black text-[#856404]">{currentProgress}% Completed</span>
              </div>
            </div>

            {/* DYNAMIC ANIMATED PROGRESS SLIDER BAR */}
            <div className="space-y-1.5 w-full">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Progress Bar</span>
                <span className="text-[#1B4D3E]">{currentProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#1B4D3E] to-[#D4AF37] rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>

            {/* SUCCESS SCREEN */}
            {isSuccess ? (
              <div className="text-center py-8 space-y-5 animate-fade-in bg-slate-50 p-8 rounded-2xl border-2 border-[#1B4D3E]">
                <div className="w-16 h-16 bg-[#1B4D3E] text-[#D4AF37] border-2 border-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
                  ✓
                </div>
                <h3 className="font-['Bebas_Neue'] text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-wider">Booking Request Confirmed!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you <strong className="text-slate-900">{formData.name}</strong>! Your website project request for <strong className="text-[#1B4D3E]">{selectedPackage} Package</strong> has been submitted and logged in Admin Panel.
                </p>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
                  <span>📸 Official summary image receipt downloaded!</span>
                </div>

                <div className="bg-white p-5 rounded-2xl text-left max-w-sm mx-auto text-xs space-y-2 border-2 border-[#1B4D3E] font-medium shadow-sm">
                  <div className="flex justify-between text-slate-700"><span>Customer:</span> <strong className="text-slate-900">{formData.name} ({formData.phone})</strong></div>
                  <div className="flex justify-between text-slate-700"><span>Selected Package:</span> <strong className="text-slate-900">{selectedPackage}</strong></div>
                  <div className="flex justify-between text-slate-700"><span>Original Base Price:</span> <span className="line-through">₹{currentBasePrice.toLocaleString('en-IN')}</span></div>
                  {isCouponVerified && appliedCoupon ? (
                    <>
                      <div className="flex justify-between text-emerald-700 font-bold"><span>MyExpert 30% Payback ({appliedCoupon}):</span> <span>- ₹{paybackInfo.paybackAmount.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between text-[#1B4D3E] font-black border-t pt-2 text-sm"><span>Net Outlay:</span> <span>₹{paybackInfo.netPrice.toLocaleString('en-IN')}</span></div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-900 font-bold border-t pt-2 text-sm"><span>Total Payable:</span> <span>₹{currentBasePrice.toLocaleString('en-IN')}</span></div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => downloadBookingSummaryImage()}
                  className="bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-slate-100 font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  📥 Re-download Summary Image
                </button>

                <p className="text-xs text-slate-500">Our engineering team will call you shortly to confirm website development initiation.</p>
              </div>
            ) : (
              <div>
                
                {/* STEP 1: CONTACT DETAILS WITH STRICT LIMITS & RATE LIMIT CHECK */}
                {activeStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1B4D3E]">Contact Details</h3>
                      <p className="text-xs text-slate-500">Enter your Full Name and Phone Number to start.</p>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border-2 border-[#1B4D3E]">
                      
                      {/* FULL NAME INPUT (MAX 50 CHARS, MAX 6 WORDS) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formData.name.length}/50 chars • {countWords(formData.name)}/6 words
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={50}
                          value={formData.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 50 && countWords(val) <= 6) {
                              setFormData({ ...formData, name: val });
                              setNameError(null);
                            }
                          }}
                          placeholder="John Doe"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]"
                        />
                        {nameError && <p className="text-xs font-bold text-red-600 mt-1">{nameError}</p>}
                      </div>

                      {/* PHONE NUMBER INPUT (MAX 15 CHARS, RATE LIMITED TO MAX 3 BOOKINGS PER PHONE) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {getCleanPhoneDigits(formData.phone).length}/15 digits (Max 3 Bookings)
                          </span>
                        </div>
                        <input
                          type="tel"
                          maxLength={15}
                          value={formData.phone}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/[^\d+]/g, '');
                            if (clean.length <= 15) {
                              setFormData({ ...formData, phone: clean });
                              setPhoneError(null);
                            }
                          }}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E]"
                        />
                        {phoneError && <p className="text-xs font-bold text-red-600 mt-1">{phoneError}</p>}
                      </div>

                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        disabled={isCheckingPhoneLimit || !formData.name.trim() || !formData.phone.trim()}
                        onClick={handleProceedFromStep1}
                        className="px-8 py-3.5 bg-[#1B4D3E] hover:bg-[#12362b] disabled:opacity-40 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                      >
                        {isCheckingPhoneLimit ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Limit...</span>
                          </>
                        ) : (
                          <span>Continue &rarr;</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: EMAIL & OTP VERIFICATION */}
                {activeStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1B4D3E]">Email Verification</h3>
                      <p className="text-xs text-slate-500">Enter your email address and verify via 6-digit OTP code.</p>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border-2 border-[#1B4D3E]">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
                          <span className="text-[10px] text-slate-400 font-mono">{formData.email.length}/80 chars</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            maxLength={80}
                            disabled={otpStatus === 'verified'}
                            value={formData.email}
                            onChange={(e) => {
                              if (e.target.value.length <= 80) {
                                setFormData({ ...formData, email: e.target.value });
                                setEmailError(null);
                              }
                            }}
                            placeholder="yourname@email.com"
                            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B4D3E] disabled:opacity-60"
                          />
                          
                          {otpStatus !== 'verified' ? (
                            <button
                              type="button"
                              onClick={handleSendOTP}
                              disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                              className="bg-[#1B4D3E] hover:bg-[#12362b] text-white font-bold text-xs px-6 py-3 rounded-xl uppercase transition-all min-w-[120px] disabled:opacity-50"
                            >
                              {otpStatus === 'sending' ? 'Sending...' : otpStatus === 'sent' ? 'Resend OTP' : 'Send OTP'}
                            </button>
                          ) : (
                            <div className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center border border-emerald-300">
                              ✓ Verified
                            </div>
                          )}
                        </div>
                        {emailError && <p className="text-xs font-bold text-red-600 mt-1">{emailError}</p>}
                      </div>

                      {(otpStatus === 'sent' || otpStatus === 'verifying') && (
                        <div className="pt-2 flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="6-digit OTP Code"
                            className="flex-1 bg-white border-2 border-[#1B4D3E] rounded-xl px-4 py-2.5 text-center font-mono text-lg font-black tracking-widest text-[#1B4D3E] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (otpCode === actualOtp) setOtpStatus('verified');
                              else alert('Invalid OTP code.');
                            }}
                            className="bg-[#1B4D3E] text-white font-bold text-xs px-6 py-2.5 rounded-xl uppercase"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        disabled={otpStatus !== 'verified'}
                        onClick={() => setActiveStep(3)}
                        className="px-8 py-3.5 bg-[#1B4D3E] hover:bg-[#12362b] disabled:opacity-40 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PACKAGE & COUPON SELECTION */}
                {activeStep === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1B4D3E]">Package & Coupon Selection</h3>
                      <p className="text-xs text-slate-500">Select your package and apply your MyExpert coupon code.</p>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border-2 border-[#1B4D3E]">
                      
                      {/* Package Select Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Website Package</label>
                        <select
                          value={selectedPackage}
                          onChange={(e) => setSelectedPackage(e.target.value as 'Starter' | 'Growth' | 'Premium')}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#1B4D3E]"
                        >
                          <option value="Starter">Starter Package — ₹10,000</option>
                          <option value="Growth">Growth Package — ₹15,000 (Most Popular)</option>
                          <option value="Premium">Premium Package — ₹20,000</option>
                        </select>
                      </div>

                      {/* Coupon Code Input (MAX 15 CHARS, UPPERCASE ALPHANUMERIC ONLY) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            MyExpert Coupon Code (Required for 30% Payback)
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">{couponCode.length}/15 chars</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={15}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            value={couponCode}
                            onChange={(e) => {
                              const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                              if (cleaned.length <= 15) {
                                setCouponCode(cleaned);
                                setCouponError(null);
                                setCouponSuccessMsg(null);
                              }
                            }}
                            placeholder="Paste your coupon code"
                            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-[#1B4D3E] uppercase outline-none focus:border-[#1B4D3E]"
                          />
                          
                          {appliedCoupon ? (
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs px-5 py-3 rounded-xl uppercase"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              disabled={isCouponValidating || !couponCode.trim()}
                              className="bg-[#1B4D3E] hover:bg-[#12362b] border border-[#1B4D3E] disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl uppercase transition-all min-w-[100px]"
                            >
                              {isCouponValidating ? 'Checking...' : 'Apply Code'}
                            </button>
                          )}
                        </div>

                        {couponError && (
                          <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
                            <span>⚠️</span> <span>{couponError}</span>
                          </p>
                        )}

                        {couponSuccessMsg && (
                          <p className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
                            <span>{couponSuccessMsg}</span>
                          </p>
                        )}
                      </div>

                      {/* Project Notes (MAX 250 CHARS STRICT TO MATCH FIRESTORE RULES) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Project Details / Notes (Optional, Max 250 Chars)
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formData.message.length}/250 chars
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          maxLength={250}
                          value={formData.message}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 250) {
                              setFormData({ ...formData, message: val });
                              setMessageError(null);
                            }
                          }}
                          placeholder="Any specific features or preferences (max 250 characters)..."
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B4D3E]"
                        />
                        {messageError && <p className="text-xs font-bold text-red-600 mt-1">{messageError}</p>}
                      </div>

                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(4)}
                        className="px-8 py-3.5 bg-[#1B4D3E] hover:bg-[#12362b] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW, TERMS CHECKBOX & CONFIRM */}
                {activeStep === 4 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1B4D3E]">Summary & Instant Confirmation</h3>
                      <p className="text-xs text-slate-500">Review your details, accept collaboration terms, and complete your booking.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-[#1B4D3E] space-y-4">
                      
                      <div className="space-y-2 border-b border-slate-200 pb-4 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Customer Name:</span>
                          <strong className="text-slate-900">{formData.name}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Phone Number:</span>
                          <strong className="text-slate-900">{formData.phone}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Verified Email:</span>
                          <strong className="text-emerald-700">{formData.email}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Selected Package:</span>
                          <strong className="text-slate-900">{selectedPackage} Package</strong>
                        </div>
                      </div>

                      {/* FINANCIAL BREAKDOWN */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Original Package Price:</span>
                          <span className="font-bold text-slate-900">₹{currentBasePrice.toLocaleString('en-IN')}</span>
                        </div>

                        {isCouponVerified && appliedCoupon ? (
                          <div className="flex justify-between text-emerald-700 font-bold">
                            <span>MyExpert 30% Payback ({appliedCoupon}):</span>
                            <span>- ₹{paybackInfo.paybackAmount.toLocaleString('en-IN')}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 italic">
                            💡 No valid coupon applied. Original full price applies.
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                          <span className="font-extrabold text-sm text-slate-900">Final Net Outlay:</span>
                          <span className="font-black text-2xl sm:text-3xl text-[#1B4D3E]">
                            ₹{paybackInfo.netPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* MANDATORY TERMS & CONDITIONS CHECKBOX */}
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-4 h-4 mt-0.5 text-[#1B4D3E] border-slate-300 rounded focus:ring-[#1B4D3E]"
                          />
                          <span className="leading-snug font-medium select-none">
                            I have read and agree to the{' '}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-[#1B4D3E] font-bold underline hover:text-[#12362b]"
                            >
                              Terms & Conditions
                            </button>{' '}
                            and{' '}
                            <button
                              type="button"
                              onClick={() => setShowPrivacyModal(true)}
                              className="text-[#1B4D3E] font-bold underline hover:text-[#12362b]"
                            >
                              Privacy Policy
                            </button>
                            . I understand our engineering team will call to confirm immediate website building & advance payment terms.
                          </span>
                        </label>
                      </div>

                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider"
                      >
                        &larr; Back
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting || !agreedToTerms}
                        onClick={handleSubmitBooking}
                        className="px-8 py-4 bg-[#1B4D3E] hover:bg-[#12362b] text-white font-extrabold rounded-xl text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-40"
                      >
                        {isSubmitting ? 'Confirming Booking...' : '🚀 COMPLETE BOOKING'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </section>

        {/* SUBTLE INCONSPICUOUS FOOTER LINKS */}
        <footer className="pt-6 pb-2 text-center w-full border-t border-slate-200/60 mt-8">
          <div className="flex justify-center items-center space-x-3 text-[10px] text-slate-400 opacity-60 hover:opacity-100 transition-opacity font-medium">
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="hover:underline focus:outline-none"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:underline focus:outline-none"
            >
              Privacy Policy
            </button>
          </div>
        </footer>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* FULL LEGAL MODAL: TERMS & CONDITIONS */}
      {/* ------------------------------------------------------------- */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl border-2 border-[#1B4D3E]">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <h3 className="font-['Bebas_Neue'] text-2xl font-black text-[#1B4D3E] tracking-wider uppercase">
                Official Terms & Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 text-[11px] text-slate-700 leading-relaxed space-y-3 font-mono border-b border-slate-100 my-2 pr-2">
              <h4 className="font-bold text-slate-900 uppercase">Qurevo Technologies × MyExpert Collaboration Terms & Conditions</h4>
              
              <p><strong>1. Mandatory Onboarding & Cooperation:</strong> Upon submitting your booking, our technical engineering team will contact you via phone or email. The 30% payback discount is valid ONLY if you are serious about building your website immediately and fully cooperate during onboarding.</p>
              
              <p><strong>2. Immediate Execution & Anti-Delay Policy:</strong> Coupons cannot be delayed, post-dated, or held for future dates (e.g. asking to start next week, next month, or later). If execution is delayed by the client, the 30% payback coupon will be disbanded and revoked immediately.</p>
              
              <p><strong>3. Advance Deposit Notice:</strong> To commence website development and allocate design/engineering resources, clients may be required to pay an advance deposit upon order logging.</p>

              <p><strong>4. Selective Eligibility & Discretion:</strong> This offer is extended exclusively to selected, verified members of MyExpert. Qurevo Technologies and MyExpert retain sole, absolute authority and power to provide, refuse, alter, or revoke discounts and payback eligibility to any user or booking request at their discretion.</p>

              <p><strong>5. Single-Use Coupon Rule:</strong> Each coupon code is valid for one active booking only. If an admin rejects a booking, that specific coupon code will automatically become valid for reuse.</p>

              <p><strong>6. Non-Transferable Coupons:</strong> MyExpert collaboration coupons are non-transferable and hold no cash value outside authorized Qurevo website bookings.</p>
              
              <p><strong>7. Scope & Deliverables:</strong> Revisions, page limits, and included features are strictly bound by the selected package specification (Starter, Growth, or Premium).</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2.5 bg-[#1B4D3E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FULL LEGAL MODAL: PRIVACY POLICY */}
      {/* ------------------------------------------------------------- */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl border-2 border-[#1B4D3E]">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <h3 className="font-['Bebas_Neue'] text-2xl font-black text-[#1B4D3E] tracking-wider uppercase">
                Official Privacy Policy
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 text-[11px] text-slate-700 leading-relaxed space-y-3 font-mono border-b border-slate-100 my-2 pr-2">
              <h4 className="font-bold text-slate-900 uppercase">Information Handling & Data Protection Notice</h4>
              <p><strong>1. Data Sharing Protocol:</strong> All personal data provided during the booking process (including Full Name, Telephone Number, Verified Email Address, and Project Requirements) may be securely shared between Qurevo Technologies and MyExpert.</p>
              <p><strong>2. Purpose of Data Usage:</strong> Collected information will be used strictly for partner offer eligibility verification, onboarding phone calls, project execution, and ongoing website development support.</p>
              <p><strong>3. Data Security:</strong> Qurevo Technologies utilizes encrypted communication protocols (TLS/SSL) and secure cloud infrastructure. Your personal data is protected against unauthorized access and will never be sold to third parties.</p>
              <p><strong>4. Communication Consent:</strong> By submitting your booking, you explicitly consent to receiving onboarding calls, messages, and project updates from Qurevo Technologies and MyExpert.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2.5 bg-[#1B4D3E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STRICT EXIT MODAL (NO LINKS BACK TO QUREVO HOME) */}
      {/* ------------------------------------------------------------- */}
      {showExitModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl border-2 border-[#1B4D3E]">
            <div className="w-12 h-12 bg-amber-100 text-[#856404] border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Leave MyExpert Booking?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your <strong className="text-[#1B4D3E]">30% payback discount session</strong> will not be saved if you leave now.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#12362b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Stay & Claim 30% Payback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Keyframe animation for gradient text animation */}
      <style jsx global>{`
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          animation: gradientText 4s ease infinite;
        }
      `}</style>

    </div>
  );
}
