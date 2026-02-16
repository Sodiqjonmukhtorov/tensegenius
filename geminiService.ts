
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
      Focus on Subject-Verb Agreement (tobelik) and sentence structure.
      Question: ${question}` }] }],
      config: {
        systemInstruction: "You are an expert English teacher. Use very simple language. Use bullet points for steps. Explain 'tobelik' (how verbs depend on subjects) clearly. Be encouraging.",
      }
    });
    
    return response.text || "Sorry, I couldn't process that.";
  } catch (error: any) {
    console.error("Grammar Assistant Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return lang === 'uz' ? "API kaliti o'rnatilmagan. Iltimos, Vercel sozlamalaridan API_KEY qo'shing." : "API key is missing. Please set API_KEY in environment variables.";
    }
    return "Error processing request.";
  }
}

export async function chatWithPanda(message: string, lang: Language): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `Siz TenseGenius platformasining "Panda Ustoz" (Panda Teacher) mascoti hisoblanasiz.
        Yaratuvchi: Sodiqjon Mukhtorov.
        
        JAVOB BERISH QOIDALARI:
        1. JAVOB FORMATI: Doimo qisqa, tushunarli va ketma-ketlikda (Step-by-step) javob bering.
        2. MARKDOWN: Bo'limlarni ajratish uchun qalin harflar (**), chiziqlar va nuqtalardan (bullet points) foydalaning.
        3. BILIM DOIRASI: Faqat zamonlar emas, balki ingliz tili barcha qismlari (IELTS, Speaking, Vocabulary, Grammar) bo'yicha master darajadasiz.
        4. TIL: Savol qaysi tilda bo'lsa, o'sha tilda javob bering (asosan Uzbek/English).
        5. TAYYOR SHABLON: 
           - Kirish (Salomlashish)
           - Asosiy tushuntirish (Nuqtalar bilan)
           - Misol (Gaplar)
           - Maslahat (Teacher's Tip)
        
        TONE: Juda mehribon, aqlli va motivatsiya beruvchi. Matnni bir-biriga qo'shib yozmang, oralarini ochiq qoldiring.`,
      }
    });
    
    return response.text || "Panda biroz charchadi 🐾";
  } catch (error: any) {
    console.error("Panda Chat Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return lang === 'uz' ? "⚠️ API kaliti topilmadi. Vercel-da API_KEY o'rnatilganiga ishonch hosil qiling." : "⚠️ API key is missing. Check your settings.";
    }
    return lang === 'uz' ? "Panda hozir bog'lana olmayapti 🐾" : "Panda is having trouble connecting right now 🐾";
  }
}

export async function correctPractice(text: string, tense: string, lang: Language): Promise<FeedbackResult> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analyze the following sentences focusing on ${tense} and Subject-Verb Agreement.
      Sentences:
      ${text}
      
      Tasks:
      1. Check if the Subject and Verb match (Agreement/Tobelik).
      2. Check the ${tense} specific structure.
      3. Score /10.` }] }],
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
                    properties: {
                      en: { type: Type.STRING },
                      uz: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            improvementTips: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                uz: { type: Type.STRING }
              }
            }
          },
          required: ["score", "mistakes", "improvementTips"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Practice Correction Error:", e);
    return {
      score: 0,
      mistakes: [],
      improvementTips: { en: "An error occurred during analysis.", uz: "Tahlil paytida xatolik yuz berdi." }
    };
  }
}

export async function analyzeFinalTask(text: string, lang: Language): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: `Full analysis of this 120-180 word text in ${lang === 'uz' ? 'Uzbek' : 'English'}.
      Text: ${text}
      Highlight: Tense usage accuracy, Subject-Verb agreement, and Flow.` }] }],
    });
    
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Final Task Analysis Error:", error);
    return "Could not complete analysis.";
  }
}
