

import { Theme, UserSettings } from './types';

export const SYSTEM_INSTRUCTION = `
You are HabitTracker AI — an intelligent personal assistant and analytics engine.

Your skills:
- behavioral psychology, habit formation, coaching;
- UX/UI design assistance and theme generation;
- basic data analytics: statistics, correlations, trends;
- structured thinking and clear communication.

GENERAL STYLE & RESPONSE RULES:
1. Be friendly, motivating, concise.
2. Always include practical actions.
3. If data is missing, infer reasonably.
4. If asked for analytics, provide key metrics, trends, and recommendations.
5. If asked for design/theme, return a JSON object with the theme structure along with your explanation.

FEATURE MECHANICS:
1. Streaks + Habit Score.
2. Adaptive Difficulty.
3. Correlation Analysis.
4. Small Experiments.
5. Smart Reminders.

When analyzing data, look for patterns (e.g., "You miss gym when energy is low").
If the user asks to change the theme, provide a JSON block strictly in this format inside the text:
\`\`\`json
{
  "theme": {
    "name": "Theme Name",
    "colors": {
       "primary": "#hex",
       "secondary": "#hex",
       "background": "#hex",
       "surface": "#hex",
       "text": "#hex",
       "accent": "#hex"
    }
  }
}
\`\`\`
`;

export const DEFAULT_THEME: Theme = {
  name: 'Default Light',
  colors: {
    primary: '#4F46E5', // Indigo 600
    secondary: '#818CF8', // Indigo 400
    background: '#F9FAFB', // Gray 50
    surface: '#FFFFFF', // White
    text: '#111827', // Gray 900
    accent: '#10B981', // Emerald 500
  },
};

export const DEFAULT_SETTINGS: UserSettings = {
  username: 'Guest User',
  language: 'en',
  notifications: {
    push: true,
    email: false,
    reminders: true,
  },
  privacy: {
    publicProfile: false,
    dataCollection: true,
  },
  aiConfig: {
    personality: 'coach',
  },
};

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    habits: 'Habits',
    analytics: 'Analytics',
    coach: 'AI Coach',
    settings: 'Settings',
    greetingMorning: 'Good Morning!',
    greetingBack: 'Welcome Back!',
    dailyGoal: 'Daily Goal',
    todaysFocus: "Today's Focus",
    noHabitsToday: "No habits set for today. Go to the Habits tab to add one!",
    dailyCheckin: "Daily Check-in",
    howFeeling: "How are you feeling?",
    quickNote: "Quick Note",
    newHabit: "New Habit",
    createHabit: "Create New Habit",
    title: "Title",
    goal: "Goal",
    category: "Category",
    startTracking: "Start Tracking",
    draftSaved: "Draft auto-saved",
    cancel: "Cancel",
    delete: "Delete",
    checkIn: "Check-in",
    done: "Done",
    streak: "Streak",
    days: "days",
    totalWins: "Total Wins",
    weeklyAvg: "Weekly Avg",
    bestStreak: "Best Streak",
    completionVsMood: "Completion vs. Mood",
    habitPerformance: "Habit Performance",
    coachInsight: "Coach's Insight",
    profile: "Profile & Account",
    general: "General Preferences",
    aiPersonality: "AI Personality",
    privacy: "Privacy & Data",
    language: "Language",
    notifications: "Notifications",
    pushNotifs: "Push Notifications",
    habitReminders: "Habit Reminders",
    exportData: "Export Data",
    resetApp: "Reset App",
    changeAvatar: "Change Avatar",
    logout: "Log Out",
    startTimer: "Start",
    stopTimer: "Stop",
    timeSpent: "Time Spent",
    mins: "mins",
    details: "Details",
    back: "Back",
    totalTime: "Total Time",
    history: "History",
    seconds: "s",
    minutes: "m",
    hours: "h",
    noData: "No data yet",
    discard: "Discard Draft",
    saveDraft: "Save Draft",
    close: "Close",
    uploadPhoto: "Upload Photo",
    generateAI: "Generate with AI",
    avatarPromptPlaceholder: "e.g., A futuristic cyberpunk fox",
    generating: "Generating...",
    tryAgain: "Try Again",
    save: "Save",
    skip: "Skip",
    avatarDescription: "Choose an image or let AI generate one for you.",
    enterDisplayName: "Enter display name"
  },
  ru: {
    dashboard: 'Дашборд',
    habits: 'Привычки',
    analytics: 'Аналитика',
    coach: 'AI Коуч',
    settings: 'Настройки',
    greetingMorning: 'Доброе утро!',
    greetingBack: 'С возвращением!',
    dailyGoal: 'Цель дня',
    todaysFocus: "Сегодняшний фокус",
    noHabitsToday: "На сегодня привычек нет. Добавьте новую во вкладке Привычки!",
    dailyCheckin: "Ежедневный отчет",
    howFeeling: "Как самочувствие?",
    quickNote: "Заметка",
    newHabit: "Новая привычка",
    createHabit: "Создать привычку",
    title: "Название",
    goal: "Цель",
    category: "Категория",
    startTracking: "Начать отслеживать",
    draftSaved: "Черновик сохранен",
    cancel: "Отмена",
    delete: "Удалить",
    checkIn: "Отметить",
    done: "Готово",
    streak: "Серия",
    days: "дн.",
    totalWins: "Всего побед",
    weeklyAvg: "Среднее за неделю",
    bestStreak: "Лучшая серия",
    completionVsMood: "Выполнение vs Настроение",
    habitPerformance: "Эффективность привычек",
    coachInsight: "Инсайт от Коуча",
    profile: "Профиль и Аккаунт",
    general: "Общие настройки",
    aiPersonality: "Личность AI",
    privacy: "Приватность и Данные",
    language: "Язык",
    notifications: "Уведомления",
    pushNotifs: "Push-уведомления",
    habitReminders: "Напоминания",
    exportData: "Экспорт данных",
    resetApp: "Сбросить данные",
    changeAvatar: "Изменить аватар",
    logout: "Выйти",
    startTimer: "Старт",
    stopTimer: "Стоп",
    timeSpent: "Время",
    mins: "мин",
    details: "Подробнее",
    back: "Назад",
    totalTime: "Всего времени",
    history: "История",
    seconds: "с",
    minutes: "м",
    hours: "ч",
    noData: "Нет данных",
    discard: "Удалить черновик",
    saveDraft: "Сохранить",
    close: "Закрыть",
    uploadPhoto: "Загрузить фото",
    generateAI: "Сгенерировать AI",
    avatarPromptPlaceholder: "например, Киберпанк лиса",
    generating: "Генерация...",
    tryAgain: "Попробовать снова",
    save: "Сохранить",
    skip: "Пропустить",
    avatarDescription: "Выберите фото или создайте с помощью AI.",
    enterDisplayName: "Введите имя"
  },
  uk: {
    dashboard: 'Дашборд',
    habits: 'Звички',
    analytics: 'Аналітика',
    coach: 'AI Коуч',
    settings: 'Налаштування',
    greetingMorning: 'Доброго ранку!',
    greetingBack: 'З поверненням!',
    dailyGoal: 'Ціль дня',
    todaysFocus: "Сьогоднішній фокус",
    noHabitsToday: "На сьогодні звичок немає. Додайте нову у вкладці Звички!",
    dailyCheckin: "Щоденний звіт",
    howFeeling: "Як самопочуття?",
    quickNote: "Нотатка",
    newHabit: "Нова звичка",
    createHabit: "Створити звичку",
    title: "Назва",
    goal: "Мета",
    category: "Категорія",
    startTracking: "Почати відстеження",
    draftSaved: "Чернетку збережено",
    cancel: "Скасувати",
    delete: "Видалити",
    checkIn: "Відмітити",
    done: "Готово",
    streak: "Серія",
    days: "дн.",
    totalWins: "Всього перемог",
    weeklyAvg: "Середнє за тиждень",
    bestStreak: "Краща серія",
    completionVsMood: "Виконання vs Настрій",
    habitPerformance: "Ефективність звичок",
    coachInsight: "Інсайт від Коуча",
    profile: "Профіль та Акаунт",
    general: "Загальні налаштування",
    aiPersonality: "Особистість AI",
    privacy: "Приватність та Дані",
    language: "Мова",
    notifications: "Сповіщення",
    pushNotifs: "Push-сповіщення",
    habitReminders: "Нагадування",
    exportData: "Експорт даних",
    resetApp: "Скинути дані",
    changeAvatar: "Змінити аватар",
    logout: "Вийти",
    startTimer: "Старт",
    stopTimer: "Стоп",
    timeSpent: "Час",
    mins: "хв",
    details: "Детальніше",
    back: "Назад",
    totalTime: "Всього часу",
    history: "Історія",
    seconds: "с",
    minutes: "хв",
    hours: "год",
    noData: "Немає даних",
    discard: "Видалити чернетку",
    saveDraft: "Зберегти",
    close: "Закрити",
    uploadPhoto: "Завантажити фото",
    generateAI: "Згенерувати AI",
    avatarPromptPlaceholder: "наприклад, Кіберпанк лисиця",
    generating: "Генерація...",
    tryAgain: "Спробувати ще",
    save: "Зберегти",
    skip: "Пропустити",
    avatarDescription: "Оберіть фото або створіть за допомогою AI.",
    enterDisplayName: "Введіть ім'я"
  }
};