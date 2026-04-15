import React, { useState } from 'react';
import { X, PlusCircle, FileText, PlayCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';

interface OnboardingCardProps {
  onDismiss: () => void;
}

const steps = [
  {
    id: 'create',
    title: 'Create your first session',
    description: 'Start a new session when you need to step away from your work.',
    icon: PlusCircle,
    action: 'Create Session',
    to: '/create'
  },
  {
    id: 'context',
    title: 'Mark your next step',
    description: 'Jot down your current task, why you\'re pausing, and the exact next step.',
    icon: FileText,
  },
  {
    id: 'resume',
    title: 'Resume later',
    description: 'Come back, read your notes, and pick up exactly where you left off.',
    icon: PlayCircle,
  }
];

export function OnboardingCard({ onDismiss }: OnboardingCardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-500/20 shadow-sm">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-10"
          aria-label="Dismiss onboarding"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="max-w-xl space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Master your continuity flow 🧠
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  Context Saver is your "mental save button". Follow these steps to reduce cognitive load and resume work instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                      {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {steps[currentStep].to ? (
                      <Button to={steps[currentStep].to} size="md" icon={ArrowRight}>
                        {steps[currentStep].action}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                        size="md"
                        variant="outline"
                      >
                        Next Tip
                      </Button>
                    )}
                    {currentStep < steps.length - 1 && !steps[currentStep].to && (
                      <button 
                        onClick={() => setCurrentStep(steps.length - 1)}
                        className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        Skip to end
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden lg:grid grid-cols-1 gap-4 w-full max-w-xs">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-white dark:bg-slate-900 border-indigo-500/30 shadow-md' 
                      : 'border-transparent opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm font-bold ${index === currentStep ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
