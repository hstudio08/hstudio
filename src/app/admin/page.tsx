"use client";

import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
import AdminLogin from '../../../components/AdminLogin';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'myexpert' | 'standard' | 'rejected'>('all');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchBookings();
        fetchReviews();
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchBookings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "booking_requests"));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleApproveBooking = async (id: string) => {
    try {
      await updateDoc(doc(db, "booking_requests", id), { status: "approved" });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: "approved" } : b));
    } catch (err) {
      alert("Failed to approve booking.");
    }
  };

  // BULLETPROOF REJECTION: Rejects the specific booking AND all other test bookings with the same coupon code
  const handleRejectBooking = async (id: string, couponCode?: string) => {
    const code = (couponCode || '').trim().toUpperCase();
    const hasCoupon = code && code !== 'NONE';

    const confirmMsg = hasCoupon
      ? `Reject this booking? This will ALSO reject ALL lingering test submissions for coupon "${code}" so the coupon becomes 100% available again for new bookings.`
      : "Reject this booking request?";

    if (!confirm(confirmMsg)) return;

    try {
      // 1. Reject target document
      await updateDoc(doc(db, "booking_requests", id), { status: "rejected" });

      // 2. If it has a coupon code, reject ALL other documents matching this coupon code in Firestore!
      if (hasCoupon) {
        const querySnapshot = await getDocs(collection(db, "booking_requests"));
        const batchPromises: Promise<void>[] = [];

        querySnapshot.docs.forEach((d) => {
          const data = d.data();
          const docCode = (data.couponCode || data.coupon || '').toString().trim().toUpperCase();
          if (docCode === code && d.id !== id && data.status !== 'rejected') {
            batchPromises.push(updateDoc(doc(db, "booking_requests", d.id), { status: "rejected" }));
          }
        });

        await Promise.all(batchPromises);
      }

      // 3. Update local state
      setBookings(prev => prev.map(b => {
        const bCode = (b.couponCode || b.coupon || '').toString().trim().toUpperCase();
        if (b.id === id || (hasCoupon && bCode === code)) {
          return { ...b, status: "rejected" };
        }
        return b;
      }));

      alert(hasCoupon ? `Booking rejected! Coupon "${code}" has been completely freed and is ready for reuse.` : 'Booking rejected.');
    } catch (err) {
      console.error("Rejection Error:", err);
      alert("Failed to reject booking.");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking record permanently? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "booking_requests", id));
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      await updateDoc(doc(db, "reviews", id), { status: "approved" });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: "approved" } : r));
    } catch (err) {
      alert("Failed to approve review.");
    }
  };

  const handleHideReview = async (id: string) => {
    try {
      await updateDoc(doc(db, "reviews", id), { status: "pending" });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: "pending" } : r));
    } catch (err) {
      alert("Failed to hide review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1B4D3E] rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium tracking-wide">Initializing secure admin environment...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Group & Filter Bookings
  const myExpertBookings = bookings.filter(b => b.collaborator === 'MyExpert' || b.isCouponApplied || (b.couponCode && b.couponCode !== 'None'));
  const standardBookings = bookings.filter(b => b.collaborator !== 'MyExpert' && !b.isCouponApplied && (!b.couponCode || b.couponCode === 'None'));
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');

  const displayedBookings = bookingFilter === 'myexpert'
    ? myExpertBookings
    : bookingFilter === 'standard'
    ? standardBookings
    : bookingFilter === 'rejected'
    ? rejectedBookings
    : bookings;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <Image src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp" alt="Qurevo Technologies" width={38} height={38} />
          <div>
            <h1 className="font-black text-lg text-[#1B4D3E] tracking-tight">Qurevo Technologies</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">Admin Management Hub</span>
          </div>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="text-xs font-extrabold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-red-200 shadow-sm"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* TAB CONTROLS */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'bookings' ? 'bg-[#1B4D3E] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Website Bookings</span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[10px]">{bookings.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'reviews' ? 'bg-[#1B4D3E] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Client Reviews</span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[10px]">{reviews.length}</span>
            {reviews.filter(r => r.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {reviews.filter(r => r.status === 'pending').length} New
              </span>
            )}
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <div className="space-y-6">
            
            {/* STATS & FILTER BAR */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Requests Overview</h2>
                <p className="text-xs text-slate-500">Track incoming website orders, MyExpert 30% payback claims, single-use coupon status, and rejection controls.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setBookingFilter('all')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    bookingFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Requests ({bookings.length})
                </button>

                <button
                  onClick={() => setBookingFilter('myexpert')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
                    bookingFilter === 'myexpert'
                      ? 'bg-[#1B4D3E] text-[#D4AF37] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30'
                      : 'bg-emerald-50 text-[#1B4D3E] border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <span>🏷️ MyExpert 30% Payback ({myExpertBookings.length})</span>
                </button>

                <button
                  onClick={() => setBookingFilter('standard')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    bookingFilter === 'standard' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Standard ({standardBookings.length})
                </button>

                <button
                  onClick={() => setBookingFilter('rejected')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    bookingFilter === 'rejected' ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  ❌ Rejected ({rejectedBookings.length})
                </button>
              </div>
            </div>

            {/* SPACIOUS CARD-BASED GRID LIST FOR BOOKINGS */}
            {displayedBookings.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                <p className="text-sm font-medium">No booking requests found for this filter view.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {displayedBookings.map((req) => {
                  const isMyExpert = req.collaborator === 'MyExpert' || req.isCouponApplied || (req.couponCode && req.couponCode !== 'None');
                  const isRejected = req.status === 'rejected';
                  const isApproved = req.status === 'approved';
                  const couponStr = (req.couponCode || req.coupon || '').toString().trim().toUpperCase();

                  return (
                    <div
                      key={req.id}
                      className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all shadow-sm space-y-5 ${
                        isRejected
                          ? 'border-red-300 bg-red-50/20'
                          : isMyExpert
                          ? 'border-[#1B4D3E] ring-1 ring-[#1B4D3E]/10 bg-gradient-to-r from-emerald-50/40 via-white to-white'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* CARD HEADER */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {isMyExpert ? (
                            <span className="bg-[#1B4D3E] text-[#D4AF37] border border-[#D4AF37] text-[11px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                              <span>🏷️</span> <span>MYEXPERT 30% PAYBACK CLIENT</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider border border-slate-200">
                              DIRECT WEBSITE BOOKING
                            </span>
                          )}

                          {/* STATUS BADGES */}
                          {isRejected ? (
                            <span className="bg-red-100 text-red-800 border border-red-300 text-[11px] font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider">
                              ❌ REJECTED — COUPON RESTORED
                            </span>
                          ) : isApproved ? (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider">
                              ✓ APPROVED & IN DEVELOPMENT
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-[#856404] border border-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider">
                              ⏳ PENDING ONBOARDING CALL
                            </span>
                          )}

                          {req.slug && (
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              slug: {req.slug}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-mono mr-2">
                            {req.timestamp?.seconds ? new Date(req.timestamp.seconds * 1000).toLocaleString() : 'Recent Request'}
                          </span>

                          {/* ACTION BUTTONS: REJECT, APPROVE, DELETE */}
                          {!isRejected && (
                            <button
                              onClick={() => handleRejectBooking(req.id, req.couponCode)}
                              className="text-xs font-extrabold bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-2 rounded-xl transition-all border border-red-200"
                              title="Reject Booking & Restore Coupon for Reuse"
                            >
                              Reject & Free Coupon
                            </button>
                          )}

                          {!isApproved && !isRejected && (
                            <button
                              onClick={() => handleApproveBooking(req.id)}
                              className="text-xs font-extrabold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3.5 py-2 rounded-xl transition-all border border-emerald-200"
                              title="Approve Booking"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteBooking(req.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors border border-transparent hover:border-red-200"
                            title="Delete Record Permanently"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* CARD MAIN CONTENT GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* COLUMN 1: CLIENT DETAILS */}
                        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Client Details</span>
                          <div>
                            <h3 className="font-extrabold text-base text-slate-900">{req.name}</h3>
                            <p className="text-xs font-bold text-blue-600 mt-0.5"><a href={`mailto:${req.email}`}>{req.email}</a></p>
                            <p className="text-xs font-mono text-slate-700 mt-0.5">{req.phone}</p>
                          </div>

                          {req.agreedToTerms && (
                            <div className="pt-2">
                              <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-300">
                                ✓ Terms & Advance Deposit Rule Agreed
                              </span>
                            </div>
                          )}
                        </div>

                        {/* COLUMN 2: FINANCIALS & COUPON TAG */}
                        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Package & Pricing</span>
                            <span className="inline-block mt-1 font-extrabold text-xs text-[#1B4D3E] bg-[#1B4D3E]/10 px-3 py-1 rounded-lg border border-[#1B4D3E]/20">
                              {req.packageType || req.type}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs pt-2 border-t border-slate-200">
                            {req.originalPrice ? (
                              <>
                                <div className="flex justify-between text-slate-600">
                                  <span>Base Price:</span>
                                  <span className="font-bold text-slate-900">₹{req.originalPrice.toLocaleString('en-IN')}</span>
                                </div>

                                {req.isCouponApplied || (req.couponCode && req.couponCode !== 'None') ? (
                                  <>
                                    <div className="flex justify-between text-emerald-700 font-bold">
                                      <span>MyExpert Payback (30%):</span>
                                      <span>- ₹{(req.paybackAmount || ((req.originalPrice * 30) / 100)).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-[#1B4D3E] font-black text-sm pt-1 border-t border-slate-300">
                                      <span>Net Outlay Payable:</span>
                                      <span>₹{(req.netPrice || (req.originalPrice - ((req.originalPrice * 30) / 100))).toLocaleString('en-IN')}</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-300">
                                    <span>Total Amount:</span>
                                    <span>₹{req.originalPrice.toLocaleString('en-IN')}</span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-slate-500 font-medium">Standard package pricing logged.</p>
                            )}
                          </div>
                        </div>

                        {/* COLUMN 3: COUPON & CRYPTOGRAPHIC VERIFICATION HASH */}
                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Coupon & Verification</span>
                            
                            {req.isCouponApplied || (req.couponCode && req.couponCode !== 'None') ? (
                              <div className="mt-1 space-y-1">
                                <div className="text-xs font-mono font-bold text-slate-800">
                                  Coupon Code: <span className="bg-amber-100 text-[#856404] px-2 py-0.5 rounded border border-amber-300 font-black">{req.couponCode}</span>
                                </div>

                                {isRejected ? (
                                  <p className="text-[10px] font-bold text-emerald-700 pt-0.5">
                                    🔓 Status is REJECTED — Coupon code is 100% usable again!
                                  </p>
                                ) : (
                                  <p className="text-[10px] font-bold text-[#1B4D3E] pt-0.5">
                                    🔒 Currently Active (Single-use locked until rejected)
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic block mt-1">No coupon used</span>
                            )}
                          </div>

                          {/* CRYPTOGRAPHIC VERIFICATION HASH */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Security Verification Hash</span>
                            <code className="text-[11px] font-mono font-bold text-[#1B4D3E] break-all block">
                              {req.verificationHash || 'QX-ME-VERIFIED-AUTH'}
                            </code>
                          </div>
                        </div>

                      </div>

                      {/* CLIENT NOTES / MESSAGE */}
                      {req.message && req.message !== 'No additional notes' && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Project Requirements / Client Notes</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {req.message}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Reviews Management</h2>
                <p className="text-xs text-slate-500">Approve, hide, or remove submitted customer reviews.</p>
              </div>

              <span className="bg-purple-50 text-purple-700 text-xs font-bold px-4 py-2 rounded-full border border-purple-200">
                Total Reviews: {reviews.length}
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-black">
                      <th className="p-5">Reviewer</th>
                      <th className="p-5">Rating & Review</th>
                      <th className="p-5 text-center">Status</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviews.length === 0 ? (
                      <tr><td colSpan={4} className="p-10 text-center text-slate-400 text-sm">No reviews found.</td></tr>
                    ) : reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50 transition-colors align-top">
                        <td className="p-5">
                          <p className="font-extrabold text-sm text-slate-900">{rev.name}</p>
                          <p className="text-xs text-slate-500">{rev.email || 'No email'}</p>
                        </td>
                        <td className="p-5 max-w-md">
                          <div className="flex mb-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className={`w-4 h-4 ${star <= rev.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-xs text-slate-700 italic">"{rev.review}"</p>
                        </td>
                        <td className="p-5 text-center">
                          {rev.status === 'pending' ? (
                            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Pending</span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Approved</span>
                          )}
                        </td>
                        <td className="p-5 text-right space-x-2 whitespace-nowrap">
                          {rev.status === 'pending' ? (
                            <button 
                              onClick={() => handleApproveReview(rev.id)}
                              className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200"
                            >
                              Approve
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleHideReview(rev.id)}
                              className="text-slate-600 bg-slate-50 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                            >
                              Hide
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}