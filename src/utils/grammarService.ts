import { GoogleGenAI } from "@google/genai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  let key = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!key || key === 'undefined') {
    key = process.env.GEMINI_API_KEY;
  }

  if (!key || key === 'undefined' && typeof window !== 'undefined') {
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

export const grammarService = {
  /**
   * Corrects and translates user text based on their preferred language setting.
   * 
   * @param text The user's input text (e.g., nextStep).
   * @param userId The current user's ID to fetch their preferred language.
   * @returns A polished string in the target language.
   */
  async polishString(text: string, userId?: string | null): Promise<string> {
    if (!text || text.trim() === '') return text;

    let language = 'English'; // Default

    // Try to fetch the user's preferred language from Firestore
    if (userId) {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.settings?.preferredLanguage) {
            language = data.settings.preferredLanguage;
          }
        }
      } catch (err) {
        console.warn("Could not fetch user preferred language. Defaulting to English.", err);
      }
    }

    try {
      const ai = ensureAI();
      const prompt = `You are an expert editor and translator. Please correct any grammatical errors in the following text, and translate it exactly into ${language}. Maintain the original tone, prioritize accurate technical terminology, and return ONLY the corrected/translated text with no acknowledging remarks:

TWEET/TEXT:
"${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      return response.text?.trim() || text;
    } catch (error) {
      console.error("Grammar & Translation Error:", error);
      // Fallback to original text if AI fails
      return text;
    }
  }
};
