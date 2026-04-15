/**
 * Stripe Configuration
 * Centralized Stripe Payment Links and redirect logic.
 */

export const STRIPE_LINKS = {
  plus: "https://buy.stripe.com/test_28EaEP9lj6Xj2eQ0SU4ZG00",
  pro: "https://buy.stripe.com/test_5kQ6oz0ONbdzdXyatu4ZG01"
} as const;

export type StripePlan = keyof typeof STRIPE_LINKS;

/**
 * Redirects the user to the Stripe Checkout page for the selected plan.
 * @param plan - The plan to redirect to ('plus' or 'pro')
 * @param userId - The Firebase user ID to associate with the checkout session
 */
export function redirectToCheckout(plan: StripePlan, userId?: string) {
  const url = STRIPE_LINKS[plan];
  
  if (!url) {
    console.error(`Invalid plan selected for checkout: ${plan}`);
    return;
  }

  console.log(`[Stripe] Redirecting to checkout for plan: ${plan}`);
  
  if (userId) {
    window.location.href = `${url}?client_reference_id=${userId}`;
  } else {
    window.location.href = url;
  }
}
