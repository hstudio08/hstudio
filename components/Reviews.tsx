"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  
  // State for tracking which long reviews are expanded
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  
  // Ref for the carousel container
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

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

  // Auto-scroll logic for the carousel
  useEffect(() => {
    if (reviews.length <= 1 || isHovering) return;

    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // If reached the end, snap back to the beginning
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll right by approximately one card width
          carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 4000); // 4 seconds per slide

    return () => clearInterval(scrollInterval);
  }, [reviews.length, isHovering]);

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
          ? 'Thank you for Submitting Your Review!' 
          : 'Thank you for Your Review ❤️!');
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

  const toggleReadMore = (id: string) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className={`w-4 h-4 md:w-5 md:h-5 ${filled ? 'text-sky-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section id="reviews" className="relative py-10 md:py-24 overflow-hidden flex flex-col bg-slate-50">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780769116/222_ht84yf.webp" 
          alt="Reviews Background" 
          fill 
          className="object-cover object-center opacity-30" 
          priority
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 md:px-8 w-full relative z-10 flex flex-col h-full justify-center">
        
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            Real People, <span className="font-['Satisfy'] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 font-normal px-1 text-4xl md:text-6xl drop-shadow-sm">Real Reviews</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* Authentic Carousel Slides (Left Side) */}
          <div className="lg:col-span-7 flex flex-col w-full relative" 
               onMouseEnter={() => setIsHovering(true)} 
               onMouseLeave={() => setIsHovering(false)}>
            
            {reviews.length === 0 ? (
              <div className="w-full text-blue-500 font-bold text-center py-8 bg-white/80 backdrop-blur-md rounded-3xl border border-sky-100 shadow-sm">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              <div className="relative group">
                {/* Carousel Container */}
                <div 
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-4 items-start"
                >
                  {reviews.map((rev) => {
                    const isExpanded = expandedReviews[rev.id];
                    const charLimit = 120;
                    const isLong = rev.review.length > charLimit;
                    const displayText = isExpanded || !isLong 
                      ? rev.review 
                      : rev.review.substring(0, charLimit) + "...";

                    return (
                      <div 
                        key={rev.id} 
                        className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-start bg-white/90 backdrop-blur-xl border border-sky-100 p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(14,165,233,0.06)] flex flex-col flex-shrink-0 transition-transform duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md bg-gradient-to-br from-sky-400 to-blue-600">
                              {rev.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">{rev.name}</h4>
                              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-['Familjen_Grotesk']">
                                {rev.createdAt ? new Date(rev.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} filled={star <= rev.rating} />
                          ))}
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed font-medium transition-all duration-300">
                          {displayText}
                        </p>

                        {/* Read More Button */}
                        {isLong && (
                          <button 
                            onClick={() => toggleReadMore(rev.id)}
                            className="text-sky-500 hover:text-blue-600 text-xs font-black mt-2 self-start uppercase tracking-wider font-['Familjen_Grotesk'] transition-colors"
                          >
                            {isExpanded ? 'Read Less ↑' : 'Read More ↓'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Fade Gradients & Navigation Arrows */}
                <div className="absolute left-0 top-0 bottom-4 w-12 md:w-16 bg-gradient-to-r from-slate-50/90 to-transparent pointer-events-none z-10 hidden md:block" />
                <div className="absolute right-0 top-0 bottom-4 w-12 md:w-16 bg-gradient-to-l from-slate-50/90 to-transparent pointer-events-none z-10 hidden md:block" />
              </div>
            )}
            
            {/* Navigation Controls */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-2 md:mt-4">
                <button onClick={scrollLeft} className="p-2 rounded-full bg-white border border-sky-100 text-sky-600 shadow-sm hover:bg-sky-50 hover:scale-110 transition-all focus:outline-none" aria-label="Previous review">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button onClick={scrollRight} className="p-2 rounded-full bg-white border border-sky-100 text-sky-600 shadow-sm hover:bg-sky-50 hover:scale-110 transition-all focus:outline-none" aria-label="Next review">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            )}
          </div>

          {/* Submission Form (Right Side) */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-2xl border border-sky-100 p-6 md:p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(14,165,233,0.08)] flex flex-col justify-center h-fit">
            <div className="mb-4 md:mb-6 text-center lg:text-left">
              <h3 className="text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight">Drop a Review</h3>
              <p className="text-sky-600 text-sm font-medium mt-1">Your feedback builds better experiences.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Name *" 
                  className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm font-bold rounded-xl px-4 py-2.5 md:py-3 outline-none border border-sky-100 shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email (Optional)" 
                  className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm font-bold rounded-xl px-4 py-2.5 md:py-3 outline-none border border-sky-100 shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>

              <textarea 
                value={formData.review}
                onChange={(e) => setFormData({...formData, review: e.target.value})}
                required
                rows={3}
                placeholder="Share your experience... *" 
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm font-bold rounded-xl px-4 py-2.5 md:py-3 outline-none border border-sky-100 shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
              />

              <div className="flex items-center justify-between bg-sky-50/50 px-4 py-2.5 md:py-3 rounded-xl border border-sky-100 shadow-sm">
                <span className="text-sm font-bold text-sky-900">Rating</span>
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
                className="w-full bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-black uppercase tracking-widest text-sm py-3 md:py-3.5 rounded-xl transition-all shadow-lg hover:shadow-sky-400/30 disabled:opacity-50 font-['Familjen_Grotesk'] mt-1"
              >
                {isSubmitting ? 'Processing...' : 'Submit Review'}
              </button>

              {submitMessage && (
                <div className={`text-center text-xs font-bold p-2 md:p-3 rounded-xl ${submitMessage.includes('Failed') || submitMessage.includes('error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Global style to hide the physical scrollbar while keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}} />
    </section>
  );
}