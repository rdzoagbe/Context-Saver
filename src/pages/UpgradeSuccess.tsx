import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { motion } from 'motion/react';

export function UpgradeSuccess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-200 dark:border-gray-700 shadow-2xl shadow-indigo-100 dark:shadow-none p-10 sm:p-16 text-center space-y-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            🎉 Payment successful!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed">
            Your subscription has been activated.
          </p>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/50">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              Note: Full premium features will be enabled in the upcoming synced version.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Cloud Sync</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your sessions are now safely synced across all your devices.</p>
          </div>
          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
            <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Reminders</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We'll nudge you to resume blocked or long-paused sessions.</p>
          </div>
        </div>

        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95"
          >
            Return to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
