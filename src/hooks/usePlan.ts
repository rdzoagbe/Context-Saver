import { useState, useEffect, useCallback } from 'react';
import { UserPlan, PlanType, Feature } from '../types';
import { FEATURES } from '../config/constants';
import { useAuth } from './useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [],
  plus: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters', 'analytics', 'smart_resume'],
  premium: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters', 'cloud_sync', 'history_restore', 'analytics', 'smart_resume', 'time_tracking'],
  pro: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters', 'cloud_sync', 'history_restore', 'analytics', 'smart_resume', 'time_tracking', 'confidentiality'],
};

export function usePlan() {
  const { user } = useAuth();
  const [plan, setPlanState] = useState<UserPlan>(() => {
    const saved = localStorage.getItem('simulated_plan');
    if (saved) return { type: saved as PlanType };
    return { type: 'free' };
  });

  useEffect(() => {
    if (!user) {
      // If not logged in, we can still use simulated plan or default to free
      const saved = localStorage.getItem('simulated_plan');
      if (!saved) setPlanState({ type: 'free' });
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid, 'billing', 'subscription'),
      (docSnap) => {
        // Only override if we don't have a simulated plan, or if we want real data to take precedence
        // For simulation purposes, we'll let the simulated plan in localStorage take precedence if it exists
        const saved = localStorage.getItem('simulated_plan');
        if (saved) {
          setPlanState({ type: saved as PlanType });
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          const status = data.status;
          if (status === 'active' || status === 'trialing') {
            setPlanState({ type: data.plan as PlanType, expiresAt: data.currentPeriodEnd });
          } else {
            setPlanState({ type: 'free' });
          }
        } else {
          setPlanState({ type: 'free' });
        }
      },
      (error) => {
        console.error("Error fetching plan:", error);
        const saved = localStorage.getItem('simulated_plan');
        if (!saved) setPlanState({ type: 'free' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  const upgrade = useCallback(async (newPlan: PlanType) => {
    setPlanState({ type: newPlan });
    localStorage.setItem('simulated_plan', newPlan);
  }, []);

  const downgrade = useCallback(async () => {
    setPlanState({ type: 'free' });
    localStorage.setItem('simulated_plan', 'free');
  }, []);

  const isFeatureEnabled = useCallback((feature: Feature): boolean => {
    // Check if feature is globally disabled via feature flags
    if (feature === 'cloud_sync' && !FEATURES.SYNC_ENABLED) {
      return false;
    }
    
    return PLAN_FEATURES[plan.type].includes(feature);
  }, [plan.type]);

  return {
    currentPlan: plan.type,
    plan,
    upgrade,
    downgrade,
    isFeatureEnabled,
    isPro: plan.type === 'pro',
    isPremium: plan.type === 'premium',
    isPlus: plan.type === 'plus',
    isFree: plan.type === 'free',
    hasPlusOrBetter: plan.type === 'plus' || plan.type === 'premium' || plan.type === 'pro',
    hasPremiumOrBetter: plan.type === 'premium' || plan.type === 'pro'
  };
}
