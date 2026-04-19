export type SessionStatus = 'active' | 'archived' | 'done' | 'blocked';
export type Priority = 'low' | 'medium' | 'high';
export type PlanType = 'free' | 'plus' | 'premium' | 'pro';

export type Feature = 
  | 'pinned_sessions' 
  | 'templates' 
  | 'reminders' 
  | 'advanced_filters' 
  | 'cloud_sync' 
  | 'history_restore' 
  | 'analytics'
  | 'smart_resume'
  | 'time_tracking'
  | 'confidentiality';

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
  dueDate?: number;
  duration?: number; // Time spent in seconds (billable hours)
  isConfidential?: boolean; // Disables AI processing for attorney-client privilege
  collaborators?: string[]; // Array of email addresses
  userId?: string; // Adding userId for cross-collaboration querying
}

export interface UserPlan {
  type: PlanType;
  expiresAt?: number;
}
