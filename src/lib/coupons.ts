/**
 * MyExpert Collaboration Coupon Manager & Payback Calculator
 * 
 * Coupons can be dynamically configured in your .env or .env.local file:
 * NEXT_PUBLIC_MYEXPERT_COUPONS=QTME5419X5,MEQT5735H2,METQ6575K0,QTEMI8659G,QETMW45L7
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const DEFAULT_MYEXPERT_COUPONS = [
  "QTME5419X5",
  "MEQT5735H2",
  "METQ6575K0",
  "QTEMI8659G",
  "QETMW45L7"
];

export const MYEXPERT_PAYBACK_PERCENTAGE = 30;

/**
 * Retrieves the active array of valid coupon codes.
 * Prioritizes environment variables (comma-separated) over hardcoded defaults.
 */
export function getValidMyExpertCoupons(): string[] {
  const envCoupons = process.env.NEXT_PUBLIC_MYEXPERT_COUPONS;
  if (envCoupons && envCoupons.trim() !== '') {
    return envCoupons
      .split(',')
      .map((code) => code.trim().toUpperCase())
      .filter((code) => code.length > 0);
  }
  return DEFAULT_MYEXPERT_COUPONS;
}

/**
 * Validates whether a given coupon code is eligible for the 30% MyExpert payback.
 */
export function isValidMyExpertCoupon(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const validList = getValidMyExpertCoupons();
  return validList.includes(code.trim().toUpperCase());
}

/**
 * Checks Firestore to see if a coupon code is currently tied to an ACTIVE (non-rejected) booking.
 * Uses specific query to prevent permission error.
 */
export async function isCouponAlreadyClaimed(code: string): Promise<boolean> {
  try {
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode || formattedCode === 'NONE') return false;

    const q = query(
      collection(db, "booking_requests"),
      where("couponCode", "==", formattedCode)
    );
    const snapshot = await getDocs(q);

    // Search for any document where couponCode matches AND status is not 'rejected'
    const activeBooking = snapshot.docs.find((docDoc) => {
      const data = docDoc.data();
      const docStatus = (data.status || 'new').toString().trim().toLowerCase();

      // Is a match for this coupon AND not rejected?
      return docStatus !== 'rejected';
    });

    return !!activeBooking;
  } catch (err) {
    // If client rules prevent query reading, catch gracefully without crashing
    console.warn("Coupon availability check handled gracefully:", err);
    return false;
  }
}

/**
 * Calculates payback amount and net effective price for a package.
 */
export function calculateMyExpertPayback(basePrice: number, percentage: number = MYEXPERT_PAYBACK_PERCENTAGE) {
  const paybackAmount = Math.round((basePrice * percentage) / 100);
  const netPrice = Math.max(0, basePrice - paybackAmount);
  
  return {
    basePrice,
    paybackPercentage: percentage,
    paybackAmount,
    netPrice
  };
}
