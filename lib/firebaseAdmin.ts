import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const credential = cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
    
    initializeApp({ credential });
    console.log("✅ Firebase Admin Initialized successfully.");
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

const adminDb = getFirestore();
export { adminDb };
