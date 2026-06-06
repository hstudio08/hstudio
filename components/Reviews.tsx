"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface ReviewData {
  id: string;
  name: string;
  review: string;
  rating: number;
  createdAt: any;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', review: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch only 'approved' reviews in real-time
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews: ReviewData[] = [];
      snapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() } as ReviewData);
      });
      setReviews(fetchedReviews);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitMessage(data.status === 'pending' 
          ? 'Review pending admin approval.' 
          : 'Review published successfully!');
        setFormData({ name: '', email: '', review: '', rating: 5 });
        setTimeout(() => setSubmitMessage(''), 5000);
      } else {
        setSubmitMessage('Failed to submit review.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className={`w-4 h-4 md:w-5 md:h-5 ${filled ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section id="reviews" className="relative py-12 md:py-24 overflow-hidden flex flex-col">
      
      {/* Background Image - NO DARK VIGNETTE */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780769116/222_ht84yf.webp" 
          alt="Reviews Background" 
          fill 
          className="object-cover object-center opacity-40" // Slight opacity so it blends with the white background of the site
          priority
        />
        {/* Ultra-light glass overlay just to ensure text readability without darkening */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 md:px-8 w-full relative z-10 flex flex-col h-full justify-center">
        
        {/* Professional & Impressive Heading */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            Real People, <span className="font-['Satisfy'] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-normal px-1 text-4xl md:text-6xl drop-shadow-sm">Real Reviews</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-stretch">
          
          {/* Live Reviews Display - Horizontal Scroll on Mobile to save space */}
          <div className="lg:col-span-7 flex flex-row lg:flex-col gap-4 md:gap-6 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto h-auto lg:h-[450px] snap-x snap-mandatory custom-scrollbar pb-4 lg:pb-2">
            {reviews.length === 0 ? (
              <div className="min-w-[280px] w-full text-slate-500 font-bold text-center py-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <div key={rev.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center bg-white/70 backdrop-blur-xl border border-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-1 duration-300 flex flex-col flex-shrink-0">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Avatar First Letter */}
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-black text-sm md:text-lg shadow-md ${idx % 2 === 0 ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gradient-to-br from-cyan-400 to-blue-500'}`}>
                        {rev.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-extrabold text-xs md:text-sm tracking-tight">{rev.name}</h4>
                        <p className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider font-['Familjen_Grotesk']">
                          {rev.createdAt ? new Date(rev.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} filled={star <= rev.rating} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium italic">
                    "{rev.review}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Submission Form - Compact for Mobile */}
          <div className="lg:col-span-5 bg-white/60 backdrop-blur-2xl border border-white/80 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col justify-center">
            <div className="mb-4 md:mb-6 text-center lg:text-left">
              <h3 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight">Drop a Review</h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Your feedback builds better experiences.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Name *" 
                  className="w-full bg-white/80 text-slate-900 placeholder-slate-400 text-xs md:text-sm font-bold rounded-xl px-3 py-2.5 md:px-4 md:py-3 outline-none border border-white shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email (Optional)" 
                  className="w-full bg-white/80 text-slate-900 placeholder-slate-400 text-xs md:text-sm font-bold rounded-xl px-3 py-2.5 md:px-4 md:py-3 outline-none border border-white shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <textarea 
                value={formData.review}
                onChange={(e) => setFormData({...formData, review: e.target.value})}
                required
                rows={3}
                placeholder="Share your experience... *" 
                className="w-full bg-white/80 text-slate-900 placeholder-slate-400 text-xs md:text-sm font-bold rounded-xl px-3 py-2.5 md:px-4 md:py-3 outline-none border border-white shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />

              <div className="flex items-center justify-between bg-white/50 px-4 py-2.5 md:py-3 rounded-xl border border-white shadow-sm">
                <span className="text-xs md:text-sm font-bold text-slate-700">Rating</span>
                <div className="flex space-x-1 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <StarIcon filled={star <= formData.rating} />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-xs md:text-sm py-3 md:py-3.5 rounded-xl transition-all shadow-md hover:shadow-blue-500/25 disabled:opacity-50 font-['Familjen_Grotesk'] mt-2"
              >
                {isSubmitting ? 'Processing...' : 'Submit Review'}
              </button>

              {submitMessage && (
                <div className={`text-center text-[10px] md:text-xs font-bold p-2 md:p-3 rounded-lg ${submitMessage.includes('Failed') || submitMessage.includes('error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      `}} />
    </section>
  );
}