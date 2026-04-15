import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe Configuration
 * Centralized Stripe Public Key, Payment Links and redirect logic.
 */

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Initialize Stripe safely
// This will not crash if the key is missing, but will return null
export const stripePromise = STRIPE_PUBLIC_KEY 
  ? loadStripe(STRIPE_PUBLIC_KEY) 
  : (console.warn('[Stripe] Public key is missing. Paid features will be limited.'), Promise.resolve(null));

export const STRIPE_LINKS = {
  plus: "https://buy.stripe.com/test_28EaEP9lj6Xj2eQ0SU4ZG00",
  pro: "https://buy.stripe.com/test_5kQ6oz0ONbdzdXyatu4ZG01"
} as const;

export type StripePlan = keyof typeof STRIPE_LINKS;

/**
 * Redirects the user to the Stripe Payment Link for the selected plan.
 * @param plan - The plan to redirect to ('plus' or 'pro')
 * @param userId - The Firebase user ID to associate with the checkout session
 */
export function redirectToCheckout(plan: StripePlan, userId?: string) {
  const url = STRIPE_LINKS[plan];
  
  if (!url) {
    console.error(`Invalid plan selected for checkout: ${plan}`);
    return;
  }

  // If public key is missing, we still allow redirect to payment links 
  // but log a warning as per instructions to fail gracefully.
  if (!STRIPE_PUBLIC_KEY) {
    console.warn('[Stripe] Redirecting to payment link without initialized Stripe SDK.');
  }

  console.log(`[Stripe] Redirecting to payment link for plan: ${plan}`);
  
  // Append client_reference_id to the payment link for tracking if userId exists
  const finalUrl = userId 
    ? `${url}?client_reference_id=${userId}`
    : url;

  window.location.href = finalUrl;
}
