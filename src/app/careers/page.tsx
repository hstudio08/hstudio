"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Footer from '../../../components/Footer';
import { Chelsea_Market } from 'next/font/google';
import { uploadResumeAction } from '../actions/uploadResume';

const chelseaMarket = Chelsea_Market({ weight: '400', subsets: ['latin'] });

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    developerType: 'Frontend Developer',
  });
  const [resumeImage, setResumeImage] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setStatusMsg({ type: 'error', text: 'You must agree to the Terms & Conditions and Privacy Policy.' });
      return;
    }
    if (!resumeImage) {
      setStatusMsg({ type: 'error', text: 'Please upload an image of your resume.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // 1. Upload to ImgBB securely via Server Action
      const imgData = new FormData();
      imgData.append('image', resumeImage);
      
      const resumeUrl = await uploadResumeAction(imgData);

      // 2. Save to Firebase
      await addDoc(collection(db, 'job_applications'), {
        name: formData.name,
        email: formData.email,
        developerType: formData.developerType,
        resumeUrl: resumeUrl,
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error(error);
      setStatusMsg({ type: 'error', text: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-14 relative overflow-hidden w-full">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600" />

          {isSuccess ? (
            <div className="text-center space-y-6 py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className={`text-4xl md:text-5xl font-black text-slate-900 tracking-tight ${chelseaMarket.className}`}>
                Application Submitted!
              </h1>
              <p className="text-lg text-slate-600 font-medium font-['Familjen_Grotesk'] max-w-lg mx-auto">
                Thank you for applying, {formData.name.split(' ')[0]}! Your resume has been received successfully. Our hiring team will review your profile and contact you via email shortly.
              </p>
            </div>
          ) : (
            <>
              <h1 className={`text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight ${chelseaMarket.className}`}>
                Join Qurevo Technologies
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-medium mb-10 font-['Familjen_Grotesk'] leading-relaxed">
                We are looking for passionate web developers to join our growing team. If you love building high-performance, modern websites, we want to hear from you.
              </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Rahul Sharma"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="rahul.sharma@example.com"
              />
            </div>

            {/* Developer Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-bold text-slate-700 mb-2">Role</label>
              <select
                id="type"
                required
                value={formData.developerType}
                onChange={(e) => setFormData({...formData, developerType: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
              </select>
            </div>

            {/* Resume Image */}
            <div>
              <label htmlFor="resume" className="block text-sm font-bold text-slate-700 mb-2">Resume (Image Only)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-400">PNG, JPG or JPEG</p>
                  </div>
                  <input id="resume" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                </label>
              </div>
              {resumeImage && (
                <p className="text-sm text-green-600 mt-2 font-medium">Selected: {resumeImage.name}</p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  id="agreement"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-blue-300 cursor-pointer"
                />
              </div>
              <label htmlFor="agreement" className="ml-3 text-sm font-medium text-slate-600">
                I agree that I shared all information with my own consent and can be shared to people for any hiring process or any such requirement by Qurevo Technologies. I also agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Status Message */}
            {statusMsg.text && (
              <div className={`p-4 rounded-xl text-sm font-bold ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                {statusMsg.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>

          </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
