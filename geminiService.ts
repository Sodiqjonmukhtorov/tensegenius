
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResult, Language } from "./types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

// Panda Chat uchun streaming (Optimallashtirilgan)
export async function* chatWithPandaStream(message: string, lang: Language) {
  try {
    const ai = getAI();
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are a very brief English Panda tutor. Max 20 words. Be helpful.",
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.1,
      }
    });
    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    if (error.message?.includes('429')) {
      yield lang === 'uz' ? "Hozir bandman (Limit). 1 daqiqadan so'ng yozing... 🐾" : "I'm busy (Limit). Try in 1 min... 🐾";
    } else {
      yield lang === 'uz' ? "Xatolik yuz berdi. 🐾" : "Oops, an error occurred. 🐾";
    }
  }
}

// Dars ichidagi yordamchi
export async function* askGrammarAssistantStream(question: string, tense: string, lang: Language) {
  try {
    const ai = getAI();
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Topic: ${tense}. Q: ${question}` }] }],
      config: {
        systemInstruction: "Brief English tutor. Max 2 sentences.",
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.1,
      }
    });
    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    yield error.message?.includes('429') ? "Limit reached." : "Error.";
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
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Fix ${tense}: ${text}` }] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
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
    return JSON.parse(response.text.trim());
  } catch (e) {
    return { score: 0, mistakes: [], improvementTips: { en: "Error.", uz: "Xatolik." } };
  }
}

export async function analyzeFinalTask(text: string, lang: Language): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analyze: ${text}` }] }],
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "Failed.";
  } catch (error) {
    return "Error.";
  }
}
