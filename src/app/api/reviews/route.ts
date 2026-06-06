import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../../../lib/firebase'; // Ensure this matches your firebase config path
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Initialize the Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function POST(req: Request) {
  try {
    const { name, email, review, rating } = await req.json();

    if (!name || !review || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Gemini AI Prompt for Toxicity & Sentiment Filtering
    const prompt = `You are the strict moderation AI for Qurevo Technologies, a premium web development, SEO, and video editing agency based in Srinagar, Kashmir. Our founder and lead developer is Haadi Sabzar Lone.

Analyze the following customer review for our agency. 

MODERATION RULES:
1. ZERO TOLERANCE FOR TOXICITY: If the review contains ANY profanity, abusive language, hate speech, spam, promotional links, or is completely irrelevant to our services, strictly reply with "YES" (flags it for manual admin review and hides it).
2. ALLOW GENUINE NEGATIVE FEEDBACK: If the review describes a real problem, constructive criticism, or a negative experience regarding our services, BUT uses clean, respectful, and appropriate language, strictly reply with "NO" (allows it to be published normally). Admin will manually hide it later if needed.

Reply strictly with "YES" or "NO".
Review text: "${review}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiAssessment = (response.text || '').trim().toUpperCase();
    
    // If Gemini says YES (toxic/negative), set to pending. Otherwise, auto-approve.
    const status = aiAssessment.includes('YES') ? 'pending' : 'approved';

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'reviews'), {
      name,
      email: email || null,
      review,
      rating,
      status,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      status,
      message: status === 'pending' 
        ? 'Review submitted and is pending moderation.' 
        : 'Review published successfully!'
    });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}