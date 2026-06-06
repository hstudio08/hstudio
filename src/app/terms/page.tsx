import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for Qurevo Technologies.',
};

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-14">
        
        <Link href="/" className="inline-block mb-8 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest font-['Familjen_Grotesk']">
          ← Back to Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms & Conditions</h1>
        <p className="text-sm text-slate-500 font-medium mb-12">Last Updated: June 6, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to Qurevo Technologies ("we," "our," or "us"). By accessing our website and utilizing our services—including web development, SEO optimization, and video editing—you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Services and Deliverables</h2>
            <p>
              Qurevo Technologies agrees to provide digital services as outlined in the specific package or custom quote selected by the client. Timelines and deliverables are estimates and may be subject to change based on client communication, required revisions, and technical dependencies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Payment Terms</h2>
            <p>
              All payments must be made according to the schedule agreed upon prior to project commencement. Standard packages require an upfront deposit before work begins. Qurevo Technologies reserves the right to suspend or halt services if payments are not made within the stipulated timeframes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Intellectual Property</h2>
            <p>
              Upon final and full payment, the client owns the rights to the final deliverables (website code, finalized video files). Qurevo Technologies retains the right to display the completed work in our portfolio, case studies, and marketing materials unless a specific Non-Disclosure Agreement (NDA) is signed prior to the project.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
            <p>
              Qurevo Technologies is not liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to loss of data, loss of business, or server downtimes caused by third-party hosting providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms will be subject to the exclusive jurisdiction of the courts located in Srinagar, Jammu and Kashmir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us via the contact form on our website.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}