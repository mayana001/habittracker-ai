
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Palette } from 'lucide-react';
import { Habit, DailyLog, ChatMessage, Theme } from '../types';
import { sendMessageToAI, initializeChat } from '../services/geminiService';

interface AICoachProps {
  habits: Habit[];
  logs: DailyLog[];
  chatHistory: ChatMessage[];
  onUpdateChatHistory: (history: ChatMessage[]) => void;
  onApplyTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const AICoach: React.FC<AICoachProps> = ({ habits, logs, chatHistory, onUpdateChatHistory, onApplyTheme, t }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize AI context when component mounts or data updates
    initializeChat(habits, logs);
  }, [habits, logs]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    const newHistory = [...chatHistory, userMsg];
    onUpdateChatHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAI(input, habits, logs);
      
      // Check for theme JSON in response
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      let cleanText = responseText;

      if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.theme) {
                onApplyTheme(parsed.theme);
                cleanText = responseText.replace(jsonMatch[0], '') + "\n\n(I've applied the new theme for you!)";
            }
        } catch (e) {
            console.error("Failed to parse theme JSON", e);
        }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        timestamp: Date.now(),
      };
      
      onUpdateChatHistory([...newHistory, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickAction = ({ text, icon: Icon }: { text: string; icon: any }) => (
    <button
      onClick={() => {
        setInput(text);
        // Optional: auto send
      }}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-primary/50 transition-colors"
    >
      <Icon size={14} />
      {text}
    </button>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Coach Gemini</h3>
            <p className="text-xs text-gray-500">Your behavioral analyst</p>
          </div>
        </div>
        <button 
           onClick={() => onUpdateChatHistory([])}
           className="text-xs text-gray-400 hover:text-red-500"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {chatHistory.length === 0 && (
          <div className="text-center mt-10 p-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-blue-500" size={32} />
            </div>
            <h4 className="text-gray-900 font-medium mb-2">How can I help you today?</h4>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              I can analyze your streaks, suggest habit experiments, or even change the app theme.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
               <QuickAction text="Analyze my week" icon={Sparkles} />
               <QuickAction text="Why is my motivation low?" icon={Bot} />
               <QuickAction text="Give me a dark aesthetic theme" icon={Palette} />
            </div>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-gray-400" />
                <span className="text-xs text-gray-400">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your habits..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-white p-3 rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
