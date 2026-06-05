"use client";

import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import Image from 'next/image';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [bypassSent, setBypassSent] = useState(false);
  const [bypassOtp, setBypassOtp] = useState('');
  const [actualOtp, setActualOtp] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchBookings();
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const fetchBookings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "booking_requests"));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => b.timestamp?.seconds - a.timestamp?.seconds);
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking request? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "booking_requests", id));
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;

    setErrorMsg("Requesting secure location access...");
    
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser. Login denied.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setErrorMsg("Authenticating...");
          await addDoc(collection(db, "admin_login_logs"), {
            email: email,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: serverTimestamp(),
            status: "attempt"
          });

          await signInWithEmailAndPassword(auth, email, password);
          setLoginAttempts(0);
          setErrorMsg('');
        } catch (error: any) {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          
          if (newAttempts >= 3) {
            setIsBlocked(true);
            setErrorMsg("Too many failed attempts. Security protocol triggered.");
          } else {
            let preciseError = "Invalid email or password.";
            if (error.code === 'auth/user-not-found') preciseError = "No admin account found with this email.";
            if (error.code === 'auth/wrong-password') preciseError = "Incorrect password.";
            if (error.code === 'auth/invalid-credential') preciseError = "Invalid credentials. Ensure Email/Password Auth is enabled in Firebase.";
            if (error.code === 'auth/too-many-requests') preciseError = "Account temporarily locked by Firebase due to too many failed attempts.";
            
            setErrorMsg(`${preciseError} (Attempts left: ${3 - newAttempts})`);
          }
        }
      },
      (error) => {
        setErrorMsg("Location access is strictly required to login to H Studios Admin.");
      }
    );
  };

  const handleSendBypass = async () => {
    if (otpCooldown > 0) return;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setActualOtp(otp);
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          passcode: otp,
          time: new Date(Date.now() + 15 * 60000).toLocaleTimeString()
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setBypassSent(true);
      setOtpCooldown(45);
      setErrorMsg("Bypass OTP sent to Master Admin email.");
    } catch (err) {
      setErrorMsg("Failed to send Bypass OTP. Please check EmailJS configuration.");
    }
  };

  const handleVerifyBypass = () => {
    if (bypassOtp === actualOtp && actualOtp !== '') {
      setIsBlocked(false);
      setLoginAttempts(0);
      setBypassSent(false);
      setBypassOtp('');
      setErrorMsg("Security block lifted. You may now login.");
    } else {
      setErrorMsg("Invalid Bypass OTP. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium tracking-wide">Initializing secure environment...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#a7fcfb]/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="bg-white border border-slate-200 p-10 rounded-3xl w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Image src="/logo.png" alt="H Studios" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Command</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Location verification securely enforced.</p>
          </div>

          {errorMsg && (
            <div className={`p-4 rounded-xl mb-6 text-xs font-semibold border transition-all ${isBlocked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
              {errorMsg}
            </div>
          )}

          {isBlocked ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="text-center p-6 bg-red-50 border border-red-100 rounded-2xl">
                <span className="text-4xl mb-3 block">🔒</span>
                <p className="text-sm text-red-600 font-extrabold mb-5 uppercase tracking-wide">System Locked</p>
                
                {!bypassSent ? (
                  <button 
                    onClick={handleSendBypass} 
                    disabled={otpCooldown > 0}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm px-4 py-3.5 rounded-xl transition-colors shadow-md"
                  >
                    {otpCooldown > 0 ? `Please wait ${otpCooldown}s to resend` : 'Request Bypass OTP'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="6-Digit OTP" 
                      value={bypassOtp}
                      onChange={(e) => setBypassOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 bg-white border border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-3 text-center tracking-[0.3em] font-bold text-slate-900 outline-none shadow-sm transition-all"
                    />
                    <button onClick={handleVerifyBypass} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl shadow-sm transition-colors">
                      Verify
                    </button>
                  </div>
                )}
                
                {bypassSent && otpCooldown > 0 && (
                  <p className="text-[10px] text-slate-400 mt-4 font-medium">
                    You can request a new OTP in {otpCooldown} seconds.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Admin Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="admin@hstudios.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Secure Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-sm"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-4 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 mt-2">
                Authenticate Securely
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="H Studios" width={40} height={40} />
          <span className="font-extrabold text-lg tracking-tight">Admin Dashboard</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg transition-colors border border-slate-200 hover:border-red-100">
          Sign Out
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Requests</h1>
          <span className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
            Total Requests: {bookings.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="p-5 font-extrabold">Client Details</th>
                  <th className="p-5 font-extrabold">Selected Package</th>
                  <th className="p-5 font-extrabold">Message / Details</th>
                  <th className="p-5 font-extrabold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400 text-sm font-medium">No booking requests found.</td></tr>
                ) : bookings.map((req) => (
                  <tr key={req.id} className="hover:bg-blue-50/30 transition-colors align-top">
                    <td className="p-5">
                      <p className="font-bold text-sm text-slate-900">{req.name}</p>
                      <p className="text-xs text-blue-600 mt-1"><a href={`mailto:${req.email}`}>{req.email}</a></p>
                      <p className="text-xs text-slate-500 mt-1">{req.phone}</p>
                    </td>
                    <td className="p-5">
                      <span className="bg-[#e2f2d0] text-teal-800 text-[11px] font-extrabold px-3 py-1.5 rounded-md border border-[#b4f7ab] uppercase tracking-wider inline-block">
                        {req.packageType || req.type}
                      </span>
                    </td>
                    
                    {/* Expandable Natural Wrapping Cell for the Message */}
                    <td className="p-5">
                      {req.message ? (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap break-words min-w-[250px] max-w-lg leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {req.message}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic text-sm">No details provided.</span>
                      )}
                    </td>
                    
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDelete(req.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        title="Delete Request"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}