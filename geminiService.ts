

import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Habit, DailyLog } from '../types';

let chatSession: Chat | null = null;

const getAIClient = () => {
  // Ensure we use the environment variable
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (habits: Habit[], logs: DailyLog[]) => {
  const client = getAIClient();
  
  // Contextualize the initial system instruction with current user data
  const contextPrompt = `
    ${SYSTEM_INSTRUCTION}
    
    CURRENT USER DATA:
    Habits: ${JSON.stringify(habits.map(h => ({ title: h.title, streak: h.streak, completedLast7Days: h.completedDates.slice(-7) })))}
    Recent Logs (Last 7 days): ${JSON.stringify(logs.slice(-7))}
  `;

  chatSession = client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: contextPrompt,
    },
  });
};

export const sendMessageToAI = async (message: string, habits: Habit[], logs: DailyLog[]) => {
  if (!chatSession) {
    initializeChat(habits, logs);
  }
  
  // We can optionally append fresh data context if the conversation is long, 
  // but for now we rely on the initial init or assume the AI has context.
  // To be robust, if the user changed data significantly, we might want to re-inject context, 
  // but let's keep it simple for this SPA.

  try {
    if (!chatSession) throw new Error("Chat session not initialized");
    const result = await chatSession.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error communicating with AI:", error);
    return "I'm having trouble connecting to my brain right now. Please check your internet or API key.";
  }
};

export const generateAnalysis = async (habits: Habit[], logs: DailyLog[]) => {
  const client = getAIClient();
  const prompt = `
    Analyze the following user data. 
    Habits: ${JSON.stringify(habits)}
    Logs: ${JSON.stringify(logs)}
    
    Provide a concise summary of performance, 1 trend, and 2 specific recommendations for improvement.
  `;
  
  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        systemInstruction: SYSTEM_INSTRUCTION
    }
  });
  
  return response.text;
};

export const generateAvatarImage = async (prompt: string): Promise<string | null> => {
  const client = getAIClient();
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      // Using default config for aspect ratio 1:1 implicitly if not set, or we can set it.
      // Flash image doesn't support responseMimeType
    });

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                // Return base64 data url
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating avatar:", error);
    throw error;
  }
};