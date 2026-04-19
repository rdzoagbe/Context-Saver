import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async generateResumeStrategy(session: { title: string; currentTask: string; nextStep: string; notes?: string }) {
    try {
      const prompt = `
        You are an expert productivity assistant. I am resuming a deep-work session and need a quick "Smart Resume" strategy.
        
        Session Title: ${session.title}
        Current Task: ${session.currentTask}
        Next Step: ${session.nextStep}
        Notes: ${session.notes || "No additional notes."}
        
        Please provide:
        1. A concise summary of the current context (2-3 sentences).
        2. 3 actionable micro-steps to overcome inertia and get back into flow immediately.
        3. A "Focus Tip" tailored to this specific type of work.
        
        Format the response in clean Markdown.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to generate resume strategy. Please check your AI configuration.");
    }
  }
};
