import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and Cookie guidelines for Qurevo Technologies.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-14">
        
        <Link href="/" className="inline-block mb-8 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest font-['Familjen_Grotesk']">
          ← Back to Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-500 font-medium mb-12">Last Updated: June 6, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p>
              When you interact with Qurevo Technologies through our website, we may collect personal information that you voluntarily provide to us. This includes your Name, Email Address, Phone Number, and any details you provide regarding your project requirements via our contact forms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the collected information solely for the purpose of communicating with you, verifying your identity (via OTP), fulfilling your service requests, and sending relevant administrative or technical notices. We do not sell, rent, or trade your personal data to third-party marketing companies. 
              <br/><br/>
              <strong>Hiring & Recruitment:</strong> If you submit information to us for hiring purposes (such as resumes, portfolios, or job applications), you agree that this information is shared with your own consent. Such information may be made public or shared with third parties if required by Qurevo Technologies for any hiring process, background verification, or similar requirements. Furthermore, it is the sole wish, will, and absolute right of Qurevo Technologies to accept or reject any applicant for any job or position without providing justification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              <strong> Essential Cookies:</strong> We use necessary cookies to enable core functionality, such as form security and session management. 
              <strong> Analytics Cookies:</strong> We may use analytical tracking (such as Google Analytics) to understand how visitors interact with our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept essential cookies, some parts of our website (like form submissions) may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Service Providers</h2>
            <p>
              We employ third-party services to facilitate our operations. Specifically, we use <strong>Google Firebase</strong> for secure database storage of your project requests, and <strong>EmailJS</strong> for sending automated communications like OTPs. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Security</h2>
            <p>
              The security of your data is important to us. We implement standard security measures, including SSL encryption and secure database routing, to protect your information. However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Compliance with Indian Laws</h2>
            <p>
              Qurevo Technologies is based in India and complies with the <strong>Information Technology Act, 2000</strong>, and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>. By submitting your personal data (including job applications, resumes, and contact details), you explicitly consent to the collection, processing, and storage of your data as mandated by Indian law. You have the right to request access to, correction of, or deletion of your personal data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at: <br/>
              <strong>Email:</strong> qurevo@gmail.com
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}