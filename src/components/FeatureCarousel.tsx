import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, LogOut, PlayCircle, Layers, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/Card';

const slides = [
  {
    id: 'capture',
    title: 'Capture your context',
    description: 'Quickly jot down what you\'re doing, the current hurdle, and the very next step before you switch tasks.',
    icon: Save,
    color: 'bg-indigo-600',
    image: 'https://picsum.photos/seed/capture/800/500'
  },
  {
    id: 'pause',
    title: 'Pause anytime',
    description: 'Step away for a meeting or end your day with a clear mind. Your mental state is safely preserved.',
    icon: LogOut,
    color: 'bg-violet-600',
    image: 'https://picsum.photos/seed/pause/800/500'
  },
  {
    id: 'resume',
    title: 'Resume instantly',
    description: 'Pick up exactly where you left off. Your "Next Step" is front and center, eliminating mental friction.',
    icon: PlayCircle,
    color: 'bg-emerald-600',
    image: 'https://picsum.photos/seed/resume/800/500'
  },
  {
    id: 'manage',
    title: 'Manage multiple sessions',
    description: 'Keep track of various projects and tasks. Switch between contexts without losing a single beat.',
    icon: Layers,
    color: 'bg-blue-600',
    image: 'https://picsum.photos/seed/manage/800/500'
  },
  {
    id: 'upgrade',
    title: 'Upgrade for power features',
    description: 'Unlock cloud sync, pinned sessions, and advanced organization tools to supercharge your workflow.',
    icon: Sparkles,
    color: 'bg-amber-600',
    image: 'https://picsum.photos/seed/upgrade/800/500'
  }
];

export function FeatureCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Content Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlide(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border ${
                  activeSlide === index
                    ? 'theme-surface border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${slide.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                    <slide.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-bold transition-colors ${activeSlide === index ? 'text-indigo-600 dark:text-indigo-400' : 'theme-text-primary'}`}>
                      {slide.title}
                    </h3>
                    {activeSlide === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm theme-text-secondary leading-relaxed"
                      >
                        {slide.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Image Side */}
        <div className="lg:col-span-7 relative">
          <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full" />
          <Card className="relative z-10 overflow-hidden rounded-[2.5rem] border-slate-200 dark:border-white/10 shadow-2xl bg-slate-50 dark:bg-slate-900/50 p-3">
            <div className="relative aspect-[16/10] rounded-[1.8rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner bg-white dark:bg-slate-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide}
                  src={slides[activeSlide].image}
                  alt={slides[activeSlide].title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Navigation Controls */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform backdrop-blur-sm border border-slate-200 dark:border-white/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform backdrop-blur-sm border border-slate-200 dark:border-white/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
