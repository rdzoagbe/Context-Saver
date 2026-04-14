import { PlayCircle } from 'lucide-react';

interface ResumeBoxProps {
  nextStep: string;
}

export function ResumeBox({ nextStep }: ResumeBoxProps) {
  return (
    <div className="bg-indigo-600 dark:bg-indigo-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <PlayCircle className="w-32 h-32" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Resume Context</div>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-indigo-100 uppercase tracking-widest ml-1">Your Next Step</h3>
          <p className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
            {nextStep || 'No next step defined...'}
          </p>
        </div>
        <div className="pt-4">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">
            Mark as Resumed
          </button>
        </div>
      </div>
    </div>
  );
}
