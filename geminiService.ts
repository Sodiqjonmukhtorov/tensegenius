
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResult, Language } from "./types";

// Always use named parameter for apiKey and use process.env.API_KEY directly.
// Best practice: Create a new GoogleGenAI instance right before making an API call.

export async function askGrammarAssistant(question: string, tense: string, lang: Language): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use ai.models.generateContent directly and await it.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is learning the English tense: ${tense}. 
    Please answer this question as a friendly, beginner-oriented grammar teacher in ${lang === 'uz' ? 'Uzbek' : 'English'}.
    Focus on Subject-Verb Agreement (tobelik) and sentence structure.
    Question: ${question}`,
    config: {
      systemInstruction: "You are an expert English teacher. Use very simple language. Explain 'tobelik' (how verbs depend on subjects) clearly if relevant. Be encouraging.",
    }
  });
  
  // Access the .text property directly.
  return response.text || "Sorry, I couldn't process that.";
}

export async function chatWithPanda(message: string, lang: Language): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use ai.models.generateContent directly and await it.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: `You are the mascot of TenseGenius platform. 
      Your identity: You are "TenseGenius Pandasiman".
      Your creator: You were created by "Sodiqjon Mukhtorov".
      Tone: Very cute, friendly, but professional teacher.
      Specialty: You love explaining Subject-Verb Agreement (Ega va Fe'l moslashuvi).
      Language: Respond in ${lang === 'uz' ? 'Uzbek' : 'English'}.`,
    }
  });
  
  // Access the .text property directly.
  return response.text || "Panda biroz charchadi 🐾";
}

export async function correctPractice(text: string, tense: string, lang: Language): Promise<FeedbackResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use ai.models.generateContent directly and await it.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following sentences focusing on ${tense} and Subject-Verb Agreement.
    Sentences:
    ${text}
    
    Tasks:
    1. Check if the Subject and Verb match (Agreement/Tobelik).
    2. Check the ${tense} specific structure.
    3. Score /10.`,
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

  try {
    // Access the .text property directly.
    return JSON.parse(response.text.trim());
  } catch (e) {
    return {
      score: 5,
      mistakes: [],
      improvementTips: { en: "Try checking S+V agreement.", uz: "Ega va fe'l moslashuvini tekshiring." }
    };
  }
}

export async function analyzeFinalTask(text: string, lang: Language): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use ai.models.generateContent directly and await it.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Full analysis of this 120-180 word text in ${lang === 'uz' ? 'Uzbek' : 'English'}.
    Text: ${text}
    Highlight: Tense usage accuracy, Subject-Verb agreement, and Flow.`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  
  // Access the .text property directly.
  return response.text || "Analysis failed.";
}
