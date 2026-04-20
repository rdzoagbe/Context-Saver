import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export function SEOManager() {
  const { t, preferredLanguage } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // Basic Title Logic
    let title = 'MindMark - Context-Aware Productivity';
    let description = 'Protect your context. MindMark captures and resumes your professional workflows across the web.';

    const path = location.pathname;

    if (path === '/') {
      title = `MindMark | ${t('landing.title')} ${t('landing.titleHighlight')}`;
      description = t('landing.desc');
    } else if (path === '/pricing') {
      title = `Pricing | MindMark`;
      description = t('pricing.subtitle');
    } else if (path === '/dashboard') {
      title = `Dashboard | MindMark`;
    } else if (path === '/security') {
      title = `${t('security.title')} | MindMark`;
    }

    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update lang attribute on html tag
    document.documentElement.lang = preferredLanguage.toLowerCase();
  }, [location.pathname, preferredLanguage, t]);

  return null;
}
