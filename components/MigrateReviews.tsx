"use client";

import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const historicalReviews = [
  { name: "Sheikh Rahil Yousuf", email: "", rating: 5, date: "2026-07-03T12:00:00Z", review: "I think it's lovelier than the love of jove I am profoundly exhilarated to have discovered this exquisite platform. It has bestowed upon my mind a rare tranquility and transformed my writings into enduring keepsakes, preserving both my thoughts and my voice against the erosion of time." },
  { name: "Hazik Mudasir Bhat", email: "", rating: 5, date: "2026-06-19T12:00:00Z", review: "Very great experience, 100% recommended. I know him personally, while we didn't work for a website together, instead we needed some digital help, and Haadi himself truly helped us solve our problem..I recommed him strongly" },
  { name: "Arif Imtiyaz", email: "", rating: 5, date: "2026-06-19T12:01:00Z", review: "While I personally found qurevo very great, there was a slight delay (approx one day) in the website submission due to technical problems. We dont blame them at all, as it was a technical glitch. Qurevo Technologies are 100% recommemded for businesses in kashmir and all over india.." },
  { name: "Hinan", email: "", rating: 5, date: "2026-06-19T12:02:00Z", review: "I must say, Qurevo Technologies is one of the top, modern web solution providers. They don't just make your website, instead they build your brand. Again Thankyou Haadi for helping us." },
  { name: "Imtiyaz Ahmad Bhat", email: "", rating: 5, date: "2026-06-12T12:00:00Z", review: "I have worked with Qurevo's founder two times personally, and I would recommend him as a greaat choice in terms of his webdesign and development skills." },
  { name: "Aiman", email: "aimanraja048@gmail.com", rating: 5, date: "2026-06-09T12:00:00Z", review: "Nice" },
  { name: "Hadi", email: "vnnghgcg@gmail.com", rating: 5, date: "2026-06-07T12:00:00Z", review: "Honestly, the quality of service here blew me away. The website offers high-impact solutions that help businesses scale without breaking the bank. Everything is clear, professional, and incredibly intuitive. The biggest highlight for me is the incredible ROI—the results and customer support are worth way more than the price tag. If you’re searching for a reliable platform to grow your brand and connect with more customers, this is definitely it." },
  { name: "Umar", email: "", rating: 5, date: "2026-06-07T12:01:00Z", review: "Good 💯" },
  { name: "ASRAR SHABIR", email: "asrarshabir2007@gmail.com", rating: 5, date: "2026-06-07T12:02:00Z", review: "Minimal, elegant, and thoughtfully crafted. Every detail reflects creativity and dedication. Great job!" },
  { name: "Faisal", email: "", rating: 5, date: "2026-06-07T12:03:00Z", review: "Value for money" },
  { name: "Burhan", email: "burhangull14@gmail.com", rating: 5, date: "2026-06-07T12:04:00Z", review: " I was honestly impressed with the quality of service. The website provides effective solutions that can help businesses grow without requiring a huge investment. Everything is straightforward, professional, and easy to understand. What I liked most is that it offers real value for money. The results and support are worth much more than the cost. If you're looking for a reliable platform to improve your business and reach more customers, I would definitely recommend giving it a try." },
  { name: "Suhail ahmad war", email: "", rating: 5, date: "2026-06-07T12:05:00Z", review: "Best service provider in the valley. They build your website according to your needs easily access and 100%secure Trust worthy " },
  { name: "Hazik", email: "", rating: 5, date: "2026-06-07T12:06:00Z", review: "Great choice for business.. Recommended " }
];

export default function MigrateReviews() {
  const [status, setStatus] = useState("Ready to migrate");

  const runMigration = async () => {
    setStatus("Migrating...");
    try {
      for (const rev of historicalReviews) {
        await addDoc(collection(db, "reviews"), {
          name: rev.name,
          email: rev.email,
          review: rev.review,
          rating: rev.rating,
          status: "approved", 
          createdAt: Timestamp.fromDate(new Date(rev.date)) 
        });
      }
      setStatus("Migration Complete! You can now delete this component.");
    } catch (error) {
      console.error(error);
      setStatus("Error during migration. Check console.");
    }
  };

  return (
    <div className="p-8 bg-slate-900 text-white text-center rounded-xl my-10 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Database Migration Tool</h2>
      <p className="mb-4 text-sm text-slate-400">{status}</p>
      <button 
        type="button"
        onClick={runMigration}
        className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg font-bold transition-colors"
      >
        Push 13 Historical Reviews
      </button>
    </div>
  );
}