type EventName = 
  | 'signup_completed'
  | 'login_completed'
  | 'session_created'
  | 'upgrade_clicked'
  | 'stripe_checkout_opened'
  | 'plan_selected'
  | 'landing_cta_clicked'
  | 'trial_started'
  | 'guest_mode_started'
  | 'password_suggested'
  | 'password_reset_requested'
  | 'upgrade_prompt_clicked'
  | 'meeting_summarization_started'
  | 'meeting_summarization_success'
  | 'meeting_summarization_failed';

interface EventProperties {
  [key: string]: any;
}

class AnalyticsService {
  private isDev = import.meta.env.DEV;

  track(eventName: EventName, properties?: EventProperties) {
    const eventData = {
      event: eventName,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };

    if (this.isDev) {
      console.log(`[Analytics] ${eventName}`, eventData);
    } else {
      // Future integration point for PostHog, Plausible, etc.
      // e.g., posthog.capture(eventName, properties);
      // console.log(`[Analytics] ${eventName}`, eventData); // Keep for now if we want to see it in prod without real analytics
    }
  }

  identify(userId: string, traits?: EventProperties) {
    if (this.isDev) {
      console.log(`[Analytics Identify] User: ${userId}`, traits);
    } else {
      // Future integration point
      // e.g., posthog.identify(userId, traits);
    }
  }
}

export const analytics = new AnalyticsService();
