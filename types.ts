

export interface TimeLog {
  date: string; // ISO String
  duration: number; // Seconds
}

export interface Habit {
  id: string;
  title: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'creative' | 'other';
  goal: string;
  frequency: string[]; // e.g., ["Mon", "Wed"]
  streak: number;
  completedDates: string[]; // ISO Date strings YYYY-MM-DD
  archived: boolean;
  timeLogs: TimeLog[];
  timerStart?: number; // Timestamp in ms
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  mood?: number; // 1-10
  notes?: string;
  energyLevel?: number; // 1-10
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type Language = 'en' | 'ru' | 'uk';

export interface UserSettings {
  username: string;
  avatar?: string;
  language: Language;
  notifications: {
    push: boolean;
    email: boolean;
    reminders: boolean;
  };
  privacy: {
    publicProfile: boolean;
    dataCollection: boolean;
  };
  aiConfig: {
    personality: 'coach' | 'friend' | 'analytical';
  };
}