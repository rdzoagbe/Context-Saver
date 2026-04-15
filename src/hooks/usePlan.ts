import { useState, useEffect, useCallback } from 'react';
import { UserPlan, PlanType, Feature } from '../types';
import { FEATURES } from '../config/constants';
import { useAuth } from './useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [],
  plus: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters'],
  pro: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters', 'cloud_sync', 'history_restore', 'analytics'],
};

export function usePlan() {
  const { user } = useAuth();
  const [plan, setPlanState] = useState<UserPlan>({ type: 'free' });

  useEffect(() => {
    if (!user) {
      setPlanState({ type: 'free' });
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid, 'billing', 'subscription'),
      (docSnap) => {
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
        setPlanState({ type: 'free' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  const upgrade = useCallback(async (newPlan: PlanType) => {
    // No-op locally, handled by Stripe webhook
  }, []);

  const downgrade = useCallback(async () => {
    // No-op locally, handled by Stripe webhook
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
    isPlus: plan.type === 'plus',
    isFree: plan.type === 'free',
    hasPlusOrBetter: plan.type === 'plus' || plan.type === 'pro',
  };
}
