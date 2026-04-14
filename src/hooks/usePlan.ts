import { useLocalStorage } from './useLocalStorage';
import { UserPlan, PlanType, Feature } from '../types';

const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [],
  plus: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters'],
  pro: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters', 'cloud_sync', 'history_restore', 'analytics'],
};

export function usePlan() {
  const [plan, setPlan] = useLocalStorage<UserPlan>('context-saver-plan', { type: 'free' });

  const upgrade = (newPlan: PlanType) => {
    setPlan({ type: newPlan });
  };

  const downgrade = () => {
    setPlan({ type: 'free' });
  };

  const isFeatureEnabled = (feature: Feature): boolean => {
    return PLAN_FEATURES[plan.type].includes(feature);
  };

  return {
    currentPlan: plan.type,
    plan,
    upgrade,
    downgrade,
    isFeatureEnabled,
    isPro: plan.type === 'pro',
    isPlus: plan.type === 'plus',
    isFree: plan.type === 'free',
  };
}
