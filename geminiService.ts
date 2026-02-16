
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResult, Language } from "./types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export async function askGrammarAssistant(question: string, tense: string, lang: Language): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `The user is learning the English tense: ${tense}. 
      Please answer this question as a friendly, beginner-oriented grammar teacher in ${lang === 'uz' ? 'Uzbek' : 'English'}.
      Question: ${question}` }] }],
      config: {
        systemInstruction: "You are an expert English teacher. Use very simple language. Use bullet points for steps. Explain clearly. Be encouraging.",
        temperature: 0.7,
      }
    });
    
    return response.text || "Sorry, I couldn't process that.";
  } catch (error: any) {
    console.error("Grammar Assistant Error:", error);
    return "Error processing request.";
  }
}

export async function* chatWithPandaStream(message: string, lang: Language) {
  try {
    const ai = getAI();
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `Siz TenseGenius platformasining "Panda Ustoz" mascoti hisoblanasiz. 
        Juda tez, qisqa va tushunarli javob bering. Markdown ishlating. 
        Har doim foydalanuvchini ruhlantiring.`,
        temperature: 0.5, // Tezlik uchun aniqroq javoblar
      }
    });
    
    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Panda Stream Error:", error);
    yield "⚠️ Error occurred.";
  }
}

export async function chatWithPanda(message: string, lang: Language): Promise<string> {
  // Legacy support
  let fullText = "";
  const stream = chatWithPandaStream(message, lang);
  for await (const chunk of stream) {
    fullText += chunk;
  }
  return fullText;
}

export async function correctPractice(text: string, tense: string, lang: Language): Promise<FeedbackResult> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analyze the following sentences focusing on ${tense}.
      Sentences: ${text}` }] }],
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
                  reason: {
                    type: Type.OBJECT,
                    properties: { en: { type: Type.STRING }, uz: { type: Type.STRING } }
                  }
                }
              }
            },
            improvementTips: {
              type: Type.OBJECT,
              properties: { en: { type: Type.STRING }, uz: { type: Type.STRING } }
            }
          },
          required: ["score", "mistakes", "improvementTips"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (e) {
    return {
      score: 0,
      mistakes: [],
      improvementTips: { en: "An error occurred.", uz: "Xatolik yuz berdi." }
    };
  }
}

export async function analyzeFinalTask(text: string, lang: Language): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Speed over Pro
      contents: [{ role: 'user', parts: [{ text: `Full analysis in ${lang === 'uz' ? 'Uzbek' : 'English'}: ${text}` }] }],
    });
    
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Could not complete analysis.";
  }
}
