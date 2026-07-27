"use client";

import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
// Import the new login component
import AdminLogin from '../../../components/AdminLogin';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews'>('bookings');
  
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
        .sort((a: any, b: any) => b.timestamp?.seconds - a.timestamp?.seconds);
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
        .sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking request? This cannot be undone.")) return;
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
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium tracking-wide">Initializing secure environment...</p>
      </div>
    );
  }

  // If not authenticated, show the separate login component
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Admin Dashboard UI (Only shown when authenticated)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <Image src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp" alt="Qurevo Technologies" width={40} height={40} />
          <span className="font-extrabold text-lg tracking-tight">Admin Dashboard</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg transition-colors border border-slate-200 hover:border-red-100">
          Sign Out
        </button>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'bookings' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Booking Requests
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${activeTab === 'reviews' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <span>Reviews</span>
            {reviews.filter(r => r.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {reviews.filter(r => r.status === 'pending').length} New
              </span>
            )}
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
                            onClick={() => handleDeleteBooking(req.id)}
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
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Reviews</h1>
              <span className="bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                Total Reviews: {reviews.length}
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="p-5 font-extrabold">Reviewer</th>
                      <th className="p-5 font-extrabold">Review & Rating</th>
                      <th className="p-5 font-extrabold text-center">Status</th>
                      <th className="p-5 font-extrabold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviews.length === 0 ? (
                      <tr><td colSpan={4} className="p-10 text-center text-slate-400 text-sm font-medium">No reviews found.</td></tr>
                    ) : reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-purple-50/30 transition-colors align-top">
                        <td className="p-5">
                          <p className="font-bold text-sm text-slate-900">{rev.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{rev.email || 'No email'}</p>
                          <p className="text-[10px] text-slate-400 mt-2 uppercase font-['Familjen_Grotesk'] tracking-wider">
                            {rev.createdAt ? new Date(rev.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                          </p>
                        </td>
                        <td className="p-5 max-w-md">
                          <div className="flex mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className={`w-4 h-4 ${star <= rev.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-sm text-slate-700 italic">"{rev.review}"</p>
                        </td>
                        <td className="p-5 text-center">
                          {rev.status === 'pending' ? (
                            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pending (AI Flagged)</span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Approved</span>
                          )}
                        </td>
                        <td className="p-5 text-right space-x-2 whitespace-nowrap">
                          {rev.status === 'pending' ? (
                            <button 
                              onClick={() => handleApproveReview(rev.id)}
                              className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                            >
                              Approve
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleHideReview(rev.id)}
                              className="text-slate-600 bg-slate-50 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                            >
                              Hide
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-red-200"
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
          </>
        )}
      </main>
    </div>
    
  );
}