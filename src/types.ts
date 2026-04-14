export type SessionStatus = 'active' | 'archived' | 'done' | 'blocked';
export type Priority = 'low' | 'medium' | 'high';
export type PlanType = 'free' | 'plus' | 'pro';

export type Feature = 
  | 'pinned_sessions' 
  | 'templates' 
  | 'reminders' 
  | 'advanced_filters' 
  | 'cloud_sync' 
  | 'history_restore' 
  | 'analytics';

export interface SessionLink {
  id: string;
  label: string;
  url: string;
  comment?: string;
}

export interface Session {
  id: string;
  title: string;
  category: string;
  currentTask: string;
  pauseReason: string;
  nextStep: string;
  notes: string;
  tags: string[];
  links: SessionLink[];
  priority: Priority;
  status: SessionStatus;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UserPlan {
  type: PlanType;
  expiresAt?: number;
}
