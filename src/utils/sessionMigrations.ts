import { Session } from '../types';

export const sessionMigrations = {
  migrate: (sessions: any[]): Session[] => {
    return sessions.map(session => {
      // Add missing fields for older versions
      return {
        id: session.id || crypto.randomUUID(),
        title: session.title || 'Untitled Session',
        category: session.category || 'General',
        currentTask: session.currentTask || session.context || '',
        pauseReason: session.pauseReason || '',
        nextStep: session.nextStep || '',
        notes: session.notes || '',
        tags: session.tags || [],
        links: session.links || [],
        priority: session.priority || 'medium',
        status: session.status || 'active',
        pinned: session.pinned || false,
        createdAt: session.createdAt || Date.now(),
        updatedAt: session.updatedAt || Date.now(),
      };
    });
  }
};
