import { PlayCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface ResumeBoxProps {
  nextStep: string;
  onResume?: () => void;
}

export function ResumeBox({ nextStep, onResume }: ResumeBoxProps) {
  return (
    <div className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
        <PlayCircle className="w-40 h-40" />
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">Resume Context</div>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-indigo-200 uppercase tracking-wider ml-1">Your Next Step</h3>
          <p className="text-2xl sm:text-3xl font-bold leading-tight max-w-2xl">
            {nextStep || 'No next step defined...'}
          </p>
        </div>
        <div className="pt-4">
          <Button 
            variant="secondary" 
            size="md" 
            onClick={onResume}
            className="bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-0"
          >
            Mark as Resumed
          </Button>
        </div>
      </div>
    </div>
  );
}
