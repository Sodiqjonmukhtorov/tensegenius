
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
      contents: [{ role: 'user', parts: [{ text: `English tense: ${tense}. Teacher in ${lang}. Question: ${question}` }] }],
      config: {
        systemInstruction: "Expert English teacher. Simple, encouraging, bullet points.",
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.4,
      }
    });
    
    return response.text || "Sorry, try again.";
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
        systemInstruction: `Siz Panda Ustozsiz. Qisqa, tez va mehribon javob bering. O'ylab o'tirmang, darhol javobni boshlang.`,
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.3, // Tezlik va aniqlik uchun past harorat
      }
    });
    
    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Panda Stream Error:", error);
    yield "⚠️ Xatolik.";
  }
}

export async function chatWithPanda(message: string, lang: Language): Promise<string> {
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
      contents: [{ role: 'user', parts: [{ text: `Analyze for ${tense}: ${text}` }] }],
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
      improvementTips: { en: "Error.", uz: "Xatolik." }
    };
  }
}

export async function analyzeFinalTask(text: string, lang: Language): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analyze text: ${text}` }] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Could not complete analysis.";
  }
}
