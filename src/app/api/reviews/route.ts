import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../../../lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Check for API key on initialization
if (!process.env.GEMINI_API_KEY) {
  console.error("🚨 CRITICAL: GEMINI_API_KEY is missing in your environment variables!");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, review, rating } = body;

    // ==========================================
    // 1. STRICT INPUT VALIDATION (ANTI-BOT & ANTI-FORGERY)
    // ==========================================
    if (
      !name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100 ||
      (email && (typeof email !== 'string' || email.length > 100)) ||
      !review || typeof review !== 'string' || review.trim().length === 0 || review.length > 1500 ||
      typeof rating !== 'number' || rating < 1 || rating > 5
    ) {
      console.warn("🚨 Blocked invalid payload submission.");
      return NextResponse.json({ error: 'Invalid data format or length.' }, { status: 400 });
    }

    // Sanitize inputs
    const safeName = name.trim();
    const safeEmail = email ? email.trim() : null;
    const safeReview = review.trim();

    // ==========================================
    // 2. LOG THE INCOMING REVIEW
    // ==========================================
    console.log(`\n--- NEW REVIEW SUBMISSION ---`);
    console.log(`👤 Name: ${safeName}`);
    console.log(`⭐ Rating: ${rating}/5`);
    console.log(`📝 Review: "${safeReview}"`);

    // Hyper-strict prompt: ONLY allows glowing, positive praise. 
    const prompt = `You are a strict moderation AI for Qurevo Technologies. 
Analyze this review: "${safeReview}"
Star Rating Given: ${rating} out of 5.

RULES FOR REJECTION (Reply EXACTLY with "REJECT"):
1. TOXICITY & SPAM: Contains profanity, abuse, hate speech, spam, or promotional links.
2. LOW EFFORT: The review is extremely short, vague, or unhelpful (e.g., just the word "bad", "ok", "meh", or keyboard smash).
3. NO CONSTRUCTIVE CRITICISM: ANY complaint, negative feedback, "mixed" feelings, or even polite/constructive criticism MUST be rejected. 
4. LOW RATING: Any rating of 2 stars or lower MUST be rejected.

RULES FOR APPROVAL (Reply EXACTLY with "APPROVE"):
1. PURE PRAISE ONLY: The review MUST be overwhelmingly positive, genuinely praising the services, and have a 4 or 5-star rating.

DO NOT output any other text, explanation, or punctuation. Output only "REJECT" or "APPROVE".`;

    let status = 'pending'; // Default fallback status
    
    try {
      console.log('🤖 Sending prompt to Gemini Flash Lite...');
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite', 
        contents: prompt,
      });

      const aiAssessment = (response.text || '').trim().toUpperCase();
      console.log(`🧠 Gemini Assessment Output: "${aiAssessment}"`);
      
      if (aiAssessment === 'APPROVE') {
        status = 'approved';
      } else if (aiAssessment === 'REJECT') {
        status = 'pending'; // Flags for manual admin review
      } else {
        console.warn(`⚠️ Unexpected AI output, defaulting to pending.`);
      }

    } catch (aiError: any) {
      console.error('❌ Gemini API call failed entirely:', aiError.message || aiError);
      console.log('⚠️ Defaulting review status to "pending" due to AI failure.');
    }

    console.log(`✅ Final Decision: Saving to Firestore as -> [${status.toUpperCase()}]`);
    console.log(`-----------------------------\n`);

    // ==========================================
    // 3. SAVE TO FIRESTORE
    // ==========================================
    const docRef = await addDoc(collection(db, 'reviews'), {
      name: safeName,
      email: safeEmail,
      review: safeReview,
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

  } catch (error: any) {
    console.error('🔥 Severe Server Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}