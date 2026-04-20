import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  FileText, 
  Scale,
  ListTodo,
  AlertCircle,
  History,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMeetingRecorder } from '../hooks/useMeetingRecorder';
import { geminiService } from '../services/geminiService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { analytics } from '../services/analytics';

export function MeetingNotes() {
  const { isRecording, transcript, error, startRecording, stopRecording, clearTranscript } = useMeetingRecorder();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleSummarize = async () => {
    if (!transcript) return;
    
    setIsSummarizing(true);
    analytics.track('meeting_summarization_started');
    
    try {
      const result = await geminiService.summarizeMeeting(transcript);
      setSummary(result);
      analytics.track('meeting_summarization_success');
    } catch (err) {
      console.error(err);
      analytics.track('meeting_summarization_failed');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg pt-20 pb-12 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Meeting Smart Notes</h1>
            <p className="theme-text-secondary text-sm">Capture conversations from Zoom, Teams, or Live and get AI-powered insights.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-emerald-500/20"
              >
                <Mic className="h-5 w-5" /> Start Listening
              </Button>
            ) : (
              <Button 
                onClick={stopRecording} 
                className="bg-rose-600 hover:bg-rose-700 text-white gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-rose-500/20 animate-pulse"
              >
                <Square className="h-5 w-5" /> Stop Recording
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transcript Panel */}
          <div className="flex flex-col h-[600px] border theme-border theme-surface rounded-[2rem] overflow-hidden shadow-sm relative">
            <div className="p-5 border-b theme-border flex items-center justify-between glass sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold uppercase tracking-widest theme-text-secondary">Live Transcript</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearTranscript} 
                disabled={!transcript || isRecording}
                className="h-8 text-[10px] uppercase tracking-widest gap-2"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </Button>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed theme-text-secondary"
            >
              {transcript ? (
                <div className="space-y-4">
                  {transcript.split('\n').map((line, i) => (
                    <p key={i} className="animate-in fade-in slide-in-from-bottom-1">{line}</p>
                  ))}
                  {isRecording && <span className="inline-block w-1 h-4 bg-indigo-500 animate-pulse ml-1 align-middle" />}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <Mic className="h-12 w-12 mb-4" />
                  <p>Silence is golden.<br/>Start recording to capture the conversation.</p>
                </div>
              )}
            </div>
            
            {transcript && !isRecording && (
              <div className="p-4 border-t theme-border bg-slate-50/50 dark:bg-slate-900/20">
                <Button 
                  fullWidth 
                  onClick={handleSummarize} 
                  disabled={isSummarizing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  {isSummarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Summarize with Gemini
                </Button>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <div className="flex flex-col h-[600px] border theme-border theme-surface rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-5 border-b theme-border flex items-center justify-between glass sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest theme-text-secondary">AI Smart Resume</span>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSummarizing ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-100 rounded-full animate-pulse" />
                      <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin" />
                    </div>
                    <div>
                      <p className="font-bold">Analyzing Conversation</p>
                      <p className="text-xs theme-text-secondary">Gemini is extracting decisions and action items...</p>
                    </div>
                  </motion.div>
                ) : summary ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose dark:prose-invert max-w-none prose-h1:text-xl prose-h2:text-lg prose-p:text-sm prose-li:text-sm"
                  >
                    <div className="flex items-center gap-2 mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <FileText className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Meeting Summary Generated</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <History className="h-12 w-12 mb-4" />
                    <p>No summary yet.<br/>Finish your conversation and click summarize.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Floating Tooltip/Status for "Background" feel */}
        {isRecording && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-slate-800"
          >
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Recording in background...</span>
            <div className="w-px h-4 bg-slate-700" />
            <button onClick={stopRecording} className="text-[10px] uppercase font-black hover:text-rose-400 transition-colors">Stop</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
