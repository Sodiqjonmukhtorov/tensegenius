
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResult, Language } from "./types";

// Fixed: Removed local environment search. Adhering to rule: API key must be obtained exclusively from process.env.API_KEY.

// Panda Chat uchun streaming (Optimallashtirilgan)
export async function* chatWithPandaStream(message: string, lang: Language) {
  try {
    // Fixed: Initializing client with named parameter as required.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are Panda Ustoz, a friendly and expert English tutor. 
        Always be encouraging. If the user speaks in Uzbek, you can reply in a mix of English and Uzbek. 
        Keep answers helpful but concise. Use emojis like 🐾, 🐼, ⚡.`,
        temperature: 0.7,
      }
    });
    for await (const chunk of responseStream) {
      // Fixed: chunk.text is a property, not a method.
      if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    yield lang === 'uz' ? "Kechirasiz, texnik xatolik yuz berdi. 🐾" : "Sorry, a technical error occurred. 🐾";
  }
}

// Dars ichidagi yordamchi
export async function* askGrammarAssistantStream(question: string, tense: string, lang: Language) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: `Context: English Grammar (${tense}). Question: ${question}`,
      config: {
        systemInstruction: "You are a professional grammar assistant. Explain clearly in 2-3 sentences.",
        temperature: 0.2,
      }
    });
    for await (const chunk of responseStream) {
      // Fixed: chunk.text is a property, not a method.
      if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    yield "Error occurred.";
  }
}

// Qolgan funksiyalar (Legacy compatibility)
export async function askGrammarAssistant(q: string, t: string, l: Language): Promise<string> {
  let text = "";
  for await (const chunk of askGrammarAssistantStream(q, t, l)) { text += chunk; }
  return text;
}

export async function correctPractice(text: string, tense: string, lang: Language): Promise<FeedbackResult> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an English teacher, analyze this sentence for ${tense} rules: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            mistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  reason: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, uz: { type: Type.STRING } } }
                }
              }
            },
            improvementTips: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, uz: { type: Type.STRING } } }
          },
          required: ["score", "mistakes", "improvementTips"]
        }
      }
    });
    // Fixed: response.text is a property, not a method.
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (e) {
    return { score: 0, mistakes: [], improvementTips: { en: "Could not analyze the sentence.", uz: "Gapni tahlil qilib bo'lmadi." } };
  }
}

export async function analyzeFinalTask(text: string, lang: Language): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Using gemini-3-pro-preview for complex reasoning tasks like detailed essay feedback
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide a detailed English proficiency feedback for this essay: ${text}`,
    });
    // Fixed: response.text is a property, not a method.
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Error in AI analysis.";
  }
}
