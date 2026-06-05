"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'Landing Page', budget: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', type: 'Landing Page', budget: '', message: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-slate-900 text-white rounded-t-[3rem] mt-12">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Let's build something amazing.</h2>
          <p className="text-slate-400 mb-8">Fill out the form and Haadi or someone from H Studios will get back to you within 24 hours.</p>
          <div className="w-24 h-24 bg-brand-500/20 rounded-full flex items-center justify-center blur-xl absolute" />
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
          {status === 'success' ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-brand-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Request Received!</h3>
              <p className="text-slate-400 mt-2">We will be in touch shortly.</p>
              <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-brand-400 underline">Send another message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Project Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500">
                    <option>Landing Page</option>
                    <option>E-Commerce</option>
                    <option>Web App</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Budget</label>
                  <input type="text" placeholder="$1k - $5k" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Message</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500" />
              </div>
              <button disabled={status === 'loading'} type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                {status === 'loading' ? 'Sending...' : <>Send Request <Send size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}