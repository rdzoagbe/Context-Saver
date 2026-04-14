import React, { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Save, X, AlertCircle, Pin, PinOff } from 'lucide-react';
import { Session, SessionLink, Priority, SessionStatus } from '../types';
import { sessionValidation } from '../utils/sessionValidation';
import { useNavigate } from 'react-router-dom';
import { normalizeUrl, isValidUrl } from '../utils/normalizeUrl';

interface SessionFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SessionForm({ initialData, onSubmit, onCancel }: SessionFormProps) {
  const navigate = useNavigate();
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
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {initialData?.id ? 'Edit Session' : 'New Session'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Capture what you're doing so you can resume instantly later.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Session Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border ${errors.title ? 'border-red-500' : 'border-gray-100 dark:border-gray-700'} rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg font-bold`}
                placeholder="e.g., Designing User Dashboard"
              />
              {errors.title && <p className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
                  placeholder="e.g., Work, Side Project"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold appearance-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Current Task</label>
              <textarea
                value={formData.currentTask}
                onChange={(e) => setFormData({ ...formData, currentTask: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm min-h-[100px] leading-relaxed"
                placeholder="What were you working on right now?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Pause Reason</label>
              <input
                type="text"
                value={formData.pauseReason}
                onChange={(e) => setFormData({ ...formData, pauseReason: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="e.g., Lunch break, Meeting, End of day"
              />
            </div>
          </section>

          {/* Next Step - Highlighted */}
          <section className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 dark:shadow-none space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-100 uppercase tracking-widest ml-1">The Exact Next Step</label>
              <div className="bg-indigo-500/50 px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">Crucial</div>
            </div>
            <textarea
              value={formData.nextStep}
              onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
              className={`w-full px-6 py-5 bg-white/10 border ${errors.nextStep ? 'border-red-300' : 'border-white/20'} rounded-2xl focus:ring-2 focus:ring-white/50 outline-none transition-all text-white placeholder-indigo-200 font-bold text-lg leading-relaxed`}
              placeholder="What is the very first thing you should do when you return?"
              rows={3}
            />
            {errors.nextStep && <p className="text-red-200 text-xs font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.nextStep}</p>}
          </section>

          {/* Notes */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm min-h-[150px] leading-relaxed"
              placeholder="Any other details, thoughts, or context..."
            />
          </section>
        </div>

        <div className="space-y-8">
          {/* Status & Pin */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SessionStatus })}
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold appearance-none"
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.pinned ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-400'}`}>
                  {formData.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Pin Session</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.pinned ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.pinned ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* Tags */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold"
              placeholder="e.g., design, coding, research"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">Separate tags with commas</p>
          </section>

          {/* Links */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Reference Links</label>
              <button
                type="button"
                onClick={addLink}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {formData.links.map((link) => (
                <div key={link.id} className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Link Label (e.g., Figma File)"
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.links.length === 0 && (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-4 italic">No links added yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
