import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Save, AlertCircle, Pin, PinOff, PlayCircle, Shield, ShieldAlert, Sparkles, Clipboard, Loader2 } from 'lucide-react';
import { Session, SessionLink, Priority, SessionStatus } from '../types';
import { sessionValidation } from '../utils/sessionValidation';
import { normalizeUrl, isValidUrl } from '../utils/normalizeUrl';
import { FeatureGate } from './FeatureGate';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { grammarService } from '../utils/grammarService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

interface SessionFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SessionForm({ initialData, onSubmit, onCancel }: SessionFormProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Work',
    currentTask: initialData?.currentTask || '',
    pauseReason: initialData?.pauseReason || '',
    nextStep: initialData?.nextStep || '',
    notes: initialData?.notes || '',
    tags: initialData?.tags?.join(', ') || '',
    priority: initialData?.priority || 'medium' as Priority,
    status: initialData?.status || 'active' as SessionStatus,
    pinned: initialData?.pinned || false,
    links: initialData?.links || [] as SessionLink[],
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    isConfidential: initialData?.isConfidential || false,
    duration: initialData?.duration || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automated Context Harvesting
  useEffect(() => {
    if (initialData?.id) return; // Don't harvest if editing

    const harvestContext = async () => {
      setIsHarvesting(true);
      try {
        // 1. Pre-fill Title if empty using timestamp
        if (!formData.title) {
          const now = new Date();
          const autoTitle = `Session ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          setFormData(prev => ({ ...prev, title: autoTitle }));
        }

        // 2. Read Clipboard cleanly (browsers easily throw if not focused)
        try {
          // Check for clipboard support first
          if (navigator.clipboard && navigator.clipboard.readText) {
            // Document MUST be focused for this to work in most browsers without prompt
            if (document.hasFocus()) {
              const clipboardText = await navigator.clipboard.readText();
              if (clipboardText) {
                if (isValidUrl(clipboardText)) {
                  // If clipboard is a URL, add it as a link
                   setFormData(prev => ({
                    ...prev,
                    links: [...prev.links, { id: crypto.randomUUID(), label: 'Harvested Link', url: clipboardText, comment: 'Auto-captured from clipboard' }],
                    pauseReason: prev.pauseReason || `Researching ${clipboardText}` // Don't override if already set
                  }));
                } else if (clipboardText.length > 5 && !formData.pauseReason) {
                   setFormData(prev => ({ ...prev, pauseReason: clipboardText.slice(0, 100) }));
                }
              }
            } else {
              console.log('Clipboard harvesting skipped: Document not focused');
            }
          }
        } catch (clipboardErr) {
          // This is expected if the user hasn't granted permission or document loses focus mid-read.
          // We downgrade this from a warning to a debug log to prevent scaring users in the console.
          console.log('Clipboard harvesting unavailable silently:', clipboardErr);
        }
      } catch (err) {
        console.warn('Clipboard access denied or unavailable:', err);
      } finally {
        setIsHarvesting(false);
      }
    };

    harvestContext();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      // Normalize and validate links
      const normalizedLinks = formData.links.map(link => ({
        ...link,
        url: normalizeUrl(link.url)
      }));

      const linkErrors: Record<string, string> = {};
      normalizedLinks.forEach((link, index) => {
        if (link.url && !isValidUrl(link.url)) {
          linkErrors[`link-${index}`] = 'Invalid URL';
        }
      });

      // Multilingual Grammar Correction & Translation for Next Step
      let polishedNextStep = formData.nextStep;
      if (polishedNextStep && !formData.isConfidential) {
         polishedNextStep = await grammarService.polishString(polishedNextStep, user?.uid);
      }

      const dataToValidate = {
        ...formData,
        nextStep: polishedNextStep,
        tags: tagsArray,
        links: normalizedLinks,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      };

      const validation = sessionValidation.validate(dataToValidate);
      
      if (!validation.isValid || Object.keys(linkErrors).length > 0) {
        setErrors({ ...validation.errors, ...linkErrors });
        setIsSubmitting(false);
        return;
      }

      onSubmit(dataToValidate);
    } catch (err) {
      console.error("Submit processing error:", err);
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { id: crypto.randomUUID(), label: '', url: '', comment: '' }],
    }));
  };

  const updateLink = (id: string, field: keyof SessionLink, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    }));
  };

  const removeLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-12">
      <PageHeader 
        title={initialData?.id ? t('form.editTitle') : t('form.newTitle')} 
        description={isHarvesting ? t('form.harvesting') : t('form.subTitle')}
      >
        <div className="flex items-center gap-3">
          {isHarvesting && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              {t('form.autoHarvest')}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t('form.cancel')}
          </Button>
          <Button
            type="submit"
            icon={isSubmitting ? Loader2 : Save}
            size="lg"
            className={`px-8 ${isSubmitting ? 'animate-pulse' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('form.polishing') : t('form.save')}
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelTitle')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${errors.title ? 'border-rose-500' : 'theme-border'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-semibold theme-text-primary placeholder:text-slate-400`}
                placeholder={t('form.placeholderTitle')}
              />
              {errors.title && <p className="text-rose-500 text-xs font-medium ml-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelCategory')}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                  placeholder={t('form.placeholderCategory')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelPriority')}</label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary appearance-none cursor-pointer"
                  >
                    <option value="low">{t('form.lowPriority')}</option>
                    <option value="medium">{t('form.mediumPriority')}</option>
                    <option value="high">{t('form.highPriority')}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Plus className="w-4 h-4 rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelDueDate')}</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelConfidential')}</label>
                <FeatureGate feature="confidentiality" inline>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border theme-border rounded-xl">
                    <div className="flex items-center gap-2">
                      {formData.isConfidential ? <ShieldAlert className="w-4 h-4 text-amber-500" /> : <Shield className="w-4 h-4 text-slate-400" />}
                      <span className="text-sm font-medium theme-text-primary">{t('form.confidentialMode')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isConfidential: !formData.isConfidential })}
                      className={`w-10 h-5 rounded-full transition-all relative ${formData.isConfidential ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.isConfidential ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] theme-text-secondary ml-1 mt-1">{t('form.confidentialDesc')}</p>
                </FeatureGate>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelCurrentTask')}</label>
              <textarea
                value={formData.currentTask}
                onChange={(e) => setFormData({ ...formData, currentTask: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[100px] leading-relaxed theme-text-primary font-medium placeholder:text-slate-400"
                placeholder={t('form.placeholderCurrentTask')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelPauseReason')}</label>
              <input
                type="text"
                value={formData.pauseReason}
                onChange={(e) => setFormData({ ...formData, pauseReason: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                placeholder={t('form.placeholderPauseReason')}
              />
            </div>
          </Card>

          {/* Next Step - Highlighted */}
          <div className="p-8 bg-indigo-600 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <PlayCircle className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-medium text-indigo-200 uppercase tracking-wider ml-1">{t('form.labelNextStep')}</label>
                <Badge variant="indigo" className="bg-white/20 text-white border-transparent">{t('form.crucial')}</Badge>
              </div>
              <textarea
                value={formData.nextStep}
                onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                className={`w-full px-6 py-4 bg-white/10 border ${errors.nextStep ? 'border-rose-300' : 'border-transparent'} rounded-xl focus:ring-4 focus:ring-white/20 outline-none transition-all text-white placeholder:text-indigo-200 font-semibold text-2xl leading-relaxed backdrop-blur-sm`}
                placeholder={t('form.placeholderNextStep')}
                rows={3}
              />
              {errors.nextStep && <p className="text-rose-200 text-xs font-medium ml-1 mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.nextStep}</p>}
            </div>
          </div>

          {/* Notes */}
          <Card className="space-y-4">
            <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelNotes')}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[120px] leading-relaxed theme-text-primary font-medium placeholder:text-slate-400"
              placeholder={t('form.placeholderNotes')}
            />
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status & Pin */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelStatus')}</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as SessionStatus })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary appearance-none cursor-pointer"
                >
                  <option value="active">{t('form.active')}</option>
                  <option value="blocked">{t('form.blocked')}</option>
                  <option value="done">{t('form.done')}</option>
                  <option value="archived">{t('form.archived')}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Plus className="w-4 h-4 rotate-45" />
                </div>
              </div>
            </div>

            <FeatureGate feature="pinned_sessions" inline>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${formData.pinned ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-400 border theme-border'}`}>
                    {formData.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-semibold theme-text-secondary">{t('form.labelPin')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.pinned ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.pinned ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </FeatureGate>
          </Card>

          {/* Tags */}
          <Card className="space-y-4">
            <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelTags')}</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
              placeholder={t('form.placeholderTags')}
            />
            <p className="text-xs theme-text-secondary ml-1 font-medium italic">{t('form.tagsDesc')}</p>
          </Card>

          {/* Links */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t('form.labelLinks')}</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={addLink}
              />
            </div>

            <div className="space-y-4">
              {formData.links.map((link) => (
                <div key={link.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border space-y-3 relative group hover:border-indigo-500/50 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-800 border theme-border text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 theme-text-primary placeholder:text-slate-400"
                      placeholder={t('form.placeholderLinkLabel')}
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 theme-text-primary font-medium placeholder:text-slate-400"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.links.length === 0 && (
                <div className="text-center py-6 border border-dashed theme-border rounded-xl">
                  <p className="text-sm theme-text-secondary italic font-medium">{t('form.noLinks')}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
