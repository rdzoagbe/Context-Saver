import { Session } from '../types';

export const sessionValidation = {
  validate: (data: Partial<Session>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!data.nextStep?.trim()) {
      errors.nextStep = 'Next step is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
