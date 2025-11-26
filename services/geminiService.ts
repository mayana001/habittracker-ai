import { GoogleGenerativeAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import { Habit, DailyLog } from '../types';

// Используем Vite environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const getAIClient = () => {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing");
    throw new Error("API Key not configured. Please check your environment variables.");
  }
  return new GoogleGenerativeAI(API_KEY);
};

export const initializeChat = (habits: Habit[], logs: DailyLog[]) => {
  // This is just for context preparation
  console.log('AI context prepared with', habits.length, 'habits');
};

export const sendMessageToAI = async (message: string, habits: Habit[], logs: DailyLog[]): Promise<string> => {
  try {
    const client = getAIClient();
    
    // Prepare current context
    const habitsContext = habits.map(h => 
      `${h.title}: ${h.streak} day streak, completed ${h.completedDates.length} times`
    ).join('\n');

    const recentLogs = logs.slice(-7);
    const logsContext = recentLogs.map(log => 
      `${log.date}: Mood ${log.mood || 'N/A'}, Energy ${log.energyLevel || 'N/A'}`
    ).join('\n');

    const fullPrompt = `
      ${SYSTEM_INSTRUCTION}
      
      CURRENT USER DATA:
      Habits:
      ${habitsContext}
      
      Recent Logs (Last 7 days):
      ${logsContext}
      
      User Question: ${message}
    `;

    const model = client.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return response.text();

  } catch (error: any) {
    console.error('AI Error:', error);
    
    if (error.message?.includes('API_KEY') || error.message?.includes('key') || error.message?.includes('401')) {
      throw new Error('Invalid or missing API key. Please check your Gemini API key in Vercel environment variables.');
    } else if (error.message?.includes('network') || error.message?.includes('internet')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error(`AI service error: ${error.message || 'Unknown error'}`);
    }
  }
};

export const generateAnalysis = async (habits: Habit[], logs: DailyLog[]): Promise<string> => {
  try {
    const client = getAIClient();
    
    const prompt = `
      Analyze this habit tracking data and provide:
      1. Performance summary
      2. Key trends
      3. 2 specific recommendations
      
      Habits: ${JSON.stringify(habits, null, 2)}
      Logs: ${JSON.stringify(logs.slice(-14), null, 2)}
    `;

    const model = client.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 800,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Analysis generation error:', error);
    throw error;
  }
};
