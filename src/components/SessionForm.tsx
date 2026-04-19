import React, { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Save, AlertCircle, Pin, PinOff, PlayCircle, Shield, ShieldAlert } from 'lucide-react';
import { Session, SessionLink, Priority, SessionStatus } from '../types';
import { sessionValidation } from '../utils/sessionValidation';
import { normalizeUrl, isValidUrl } from '../utils/normalizeUrl';
import { FeatureGate } from './FeatureGate';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface SessionFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SessionForm({ initialData, onSubmit, onCancel }: SessionFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    const dataToValidate = {
      ...formData,
      tags: tagsArray,
      links: normalizedLinks,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
    };

    const validation = sessionValidation.validate(dataToValidate);
    
    if (!validation.isValid || Object.keys(linkErrors).length > 0) {
      setErrors({ ...validation.errors, ...linkErrors });
      return;
    }

    onSubmit(dataToValidate);
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
        title={initialData?.id ? 'Edit Session' : 'New Session'} 
        description="Capture what you're doing so you can resume instantly later."
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={Save}
            size="lg"
            className="px-8"
          >
            Save Session
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Session Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${errors.title ? 'border-rose-500' : 'theme-border'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-semibold theme-text-primary placeholder:text-slate-400`}
                placeholder="e.g., Designing User Dashboard"
              />
              {errors.title && <p className="text-rose-500 text-xs font-medium ml-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Category / Matter</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                  placeholder="e.g., Client Smith, Project X"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Priority</label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary appearance-none cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Plus className="w-4 h-4 rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Due Date / Deadline</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Confidentiality</label>
                <FeatureGate feature="confidentiality" inline>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border theme-border rounded-xl">
                    <div className="flex items-center gap-2">
                      {formData.isConfidential ? <ShieldAlert className="w-4 h-4 text-amber-500" /> : <Shield className="w-4 h-4 text-slate-400" />}
                      <span className="text-sm font-medium theme-text-primary">Confidential Mode</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isConfidential: !formData.isConfidential })}
                      className={`w-10 h-5 rounded-full transition-all relative ${formData.isConfidential ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.isConfidential ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] theme-text-secondary ml-1 mt-1">Disables AI processing for this session.</p>
                </FeatureGate>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Current Task</label>
              <textarea
                value={formData.currentTask}
                onChange={(e) => setFormData({ ...formData, currentTask: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[100px] leading-relaxed theme-text-primary font-medium placeholder:text-slate-400"
                placeholder="What were you working on right now?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Pause Reason</label>
              <input
                type="text"
                value={formData.pauseReason}
                onChange={(e) => setFormData({ ...formData, pauseReason: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                placeholder="e.g., Lunch break, Meeting, End of day"
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
                <label className="text-xs font-medium text-indigo-200 uppercase tracking-wider ml-1">The Exact Next Step</label>
                <Badge variant="indigo" className="bg-white/20 text-white border-transparent">Crucial</Badge>
              </div>
              <textarea
                value={formData.nextStep}
                onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                className={`w-full px-6 py-4 bg-white/10 border ${errors.nextStep ? 'border-rose-300' : 'border-transparent'} rounded-xl focus:ring-4 focus:ring-white/20 outline-none transition-all text-white placeholder:text-indigo-200 font-semibold text-2xl leading-relaxed backdrop-blur-sm`}
                placeholder="What is the very first thing you should do when you return?"
                rows={3}
              />
              {errors.nextStep && <p className="text-rose-200 text-xs font-medium ml-1 mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.nextStep}</p>}
            </div>
          </div>

          {/* Notes */}
          <Card className="space-y-4">
            <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[120px] leading-relaxed theme-text-primary font-medium placeholder:text-slate-400"
              placeholder="Any other details, thoughts, or context..."
            />
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status & Pin */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Status</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as SessionStatus })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary appearance-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                  <option value="archived">Archived</option>
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
                  <span className="text-sm font-semibold theme-text-secondary">Pin Session</span>
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
            <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
              placeholder="e.g., design, coding, research"
            />
            <p className="text-xs theme-text-secondary ml-1 font-medium italic">Separate tags with commas</p>
          </Card>

          {/* Links */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Reference Links</label>
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
                      placeholder="Link Label (e.g., Figma File)"
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
                  <p className="text-sm theme-text-secondary italic font-medium">No links added yet.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
