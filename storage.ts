import { Habit, DailyLog, Theme, ChatMessage, UserSettings } from '../types';
import { DEFAULT_THEME, DEFAULT_SETTINGS } from '../constants';

const HABITS_KEY = 'ht_habits';
const LOGS_KEY = 'ht_logs';
const THEME_KEY = 'ht_theme';
const CHAT_KEY = 'ht_chat';
const SETTINGS_KEY = 'ht_settings';

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getHabits = (): Habit[] => {
  const data = localStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLogs = (logs: DailyLog[]) => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getLogs = (): DailyLog[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTheme = (theme: Theme) => {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
};

export const getTheme = (): Theme => {
  const data = localStorage.getItem(THEME_KEY);
  return data ? JSON.parse(data) : DEFAULT_THEME;
};

export const saveChatHistory = (history: ChatMessage[]) => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(history));
}

export const getChatHistory = (): ChatMessage[] => {
    const data = localStorage.getItem(CHAT_KEY);
    return data ? JSON.parse(data) : [];
}

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const getSettings = (): UserSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}
