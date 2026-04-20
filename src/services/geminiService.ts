import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  // 1. Check for AI Studio magic variable
  let key = process.env.GEMINI_API_KEY;
  
  // 2. Check for Vite environment variables (for standalone deployments)
  if (!key || key === 'undefined') {
    key = import.meta.env.VITE_GEMINI_API_KEY;
  }
  
  // 3. Check for local storage override (for debugging production)
  if ((!key || key === 'undefined') && typeof window !== 'undefined') {
    key = localStorage.getItem('GEMINI_API_KEY_OVERRIDE') || undefined;
  }

  if (!key || key === 'undefined' || key.trim() === '') {
    return null;
  }

  aiInstance = new GoogleGenAI({ apiKey: key.trim() });
  return aiInstance;
};

const ensureAI = () => {
  const ai = getAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is missing. Please set VITE_GEMINI_API_KEY in your hosting environment or provide an override in settings.');
  }
  return ai;
};

export const geminiService = {
  async summarizeMeeting(transcript: string) {
    if (!transcript.trim()) return "No conversation detected.";

    try {
      const ai = ensureAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert executive assistant. Summarize the following meeting transcript into a concise format:
        1. **Key Decisions**
        2. **Action Items** (with owners if mentioned)
        3. **Important Mentions**
        
        Transcript:
        ${transcript}`,
      });

      return response.text || "No summary generated.";
    } catch (error) {
      console.error("Gemini summarization error:", error);
      throw error;
    }
  },

  async extractImportantTopics(transcript: string) {
    try {
      const ai = ensureAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract the top 5 important topics or keywords from this conversation as a comma-separated list:
        ${transcript}`,
      });

      const text = response.text;
      return text?.split(',').map(s => s.trim()) || [];
    } catch (error) {
      console.error("Gemini topic extraction error:", error);
      return [];
    }
  },

  async generateResumeStrategy(data: { title: string; currentTask: string; nextStep: string; notes: string }) {
    try {
      const ai = ensureAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a productivity expert. Given this session context, provide a "Smart Resume Strategy" to help the user get back into deep flow:
        
        Session: ${data.title}
        Current Task: ${data.currentTask}
        Next Step: ${data.nextStep}
        Notes: ${data.notes}
        
        Give 3 punchy points to resume.`,
      });
      return response.text || "Focus on the next task.";
    } catch (error) {
      console.error("Resume strategy error:", error);
      return "Flow strategy not available right now. Just focus on the next step!";
    }
  },

  async generateLinkSummary(links: string[]) {
    try {
      const ai = ensureAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Briefly summarize the context of these URLs for a productivity session: ${links.join(', ')}`,
      });
      return response.text || "No summary available.";
    } catch (error) {
      console.error("Link summary error:", error);
      return "Contextual summary not available.";
    }
  }
};
