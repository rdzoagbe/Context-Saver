import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Monitor, 
  Apple, 
  Globe, 
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/Button';

interface DownloadDropdownProps {
  onWebClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DownloadDropdown({ onWebClick, className = '', size = 'md' }: DownloadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    {
      id: 'web',
      label: 'Web Version',
      icon: Globe,
      description: 'Use directly in your browser',
      onClick: () => {
        onWebClick();
        setIsOpen(false);
      },
      badge: 'Immediate'
    },
    {
      id: 'windows',
      label: 'Windows App',
      icon: Monitor,
      description: 'Download .exe installer',
      onClick: () => {
        window.open('https://github.com/rdzoagbe/MindMark/releases', '_blank');
        setIsOpen(false);
      },
      badge: 'Releases'
    },
    {
      id: 'mac',
      label: 'macOS App',
      icon: Apple,
      description: 'Download for Apple Silicon',
      onClick: () => {
        window.open('https://github.com/rdzoagbe/MindMark/releases', '_blank');
        setIsOpen(false);
      },
      badge: 'Releases'
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center w-full">
        <Button 
          onClick={onWebClick}
          size={size}
          className="flex-1 sm:flex-initial rounded-r-none border-r border-white/20 px-8 h-14"
        >
          Get Started
        </Button>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size={size}
          className="rounded-l-none px-4 h-14"
        >
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="absolute top-full mt-4 left-0 sm:left-auto sm:right-0 w-full sm:w-80 z-[100] theme-surface theme-border border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden p-3"
          >
            <div className="px-3 py-2 border-b theme-border mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary">Choose Platform</span>
            </div>
            
            {options.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
              >
                <div className="mt-1 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <option.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold theme-text-primary">{option.label}</span>
                    {option.id === 'web' ? (
                      <ExternalLink className="w-3 h-3 theme-text-secondary" />
                    ) : (
                      <Download className="w-3 h-3 theme-text-secondary" />
                    )}
                  </div>
                  <p className="text-[10px] theme-text-secondary line-clamp-1">{option.description}</p>
                </div>
              </button>
            ))}

            <div className="mt-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
              <p className="text-[9px] theme-text-secondary leading-tight">
                MindMark Desktop provides deeper system integration for active window capture.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
