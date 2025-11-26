import React, { useState, useRef } from 'react';
import { UserSettings, Language } from '../types';
import { 
  User, Globe, Shield, BrainCircuit, 
  ChevronDown, ChevronRight, LogOut, 
  Download, Trash2, Smartphone, Bell,
  Camera, X, Check, Image as ImageIcon
} from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  onExportData: () => void;
  onResetData: () => void;
  t: (key: string) => string;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onExportData, onResetData, t }) => {
  const [activeSection, setActiveSection] = useState<string | null>('profile');
  
  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const handleToggle = (category: keyof UserSettings, field: string) => {
    onUpdateSettings({
      ...settings,
      [category]: {
        // @ts-ignore
        ...settings[category],
        // @ts-ignore
        [field]: !settings[category][field]
      }
    });
  };

  const handleChange = (field: keyof UserSettings, value: any) => {
    onUpdateSettings({ ...settings, [field]: value });
  };

  const handleAIChange = (field: string, value: string) => {
     onUpdateSettings({
         ...settings,
         aiConfig: {
             ...settings.aiConfig,
             [field]: value
         }
     });
  };

  // Avatar Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (previewAvatar) {
      handleChange('avatar', previewAvatar);
      setShowAvatarModal(false);
      setPreviewAvatar(null);
    }
  };

  const handleCancelAvatar = () => {
    setShowAvatarModal(false);
    setPreviewAvatar(null);
  };

  const SectionHeader = ({ id, icon: Icon, title, description }: { id: string, icon: any, title: string, description: string }) => (
    <button 
      onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between p-5 transition-colors text-left group ${
        activeSection === id ? 'bg-gray-50/50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-colors ${
          activeSection === id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm'
        }`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className={`font-semibold text-base transition-colors ${activeSection === id ? 'text-primary' : 'text-gray-800'}`}>{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      {activeSection === id ? (
        <ChevronDown size={20} className="text-primary" />
      ) : (
        <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
      <div className="mb-8 px-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('settings')}</h2>
        <p className="text-gray-500 mt-2">Manage your preferences, privacy, and app experience.</p>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        
        {/* Profile Section */}
        <div>
          <SectionHeader 
            id="profile" 
            icon={User} 
            title={t('profile')} 
            description="Manage your identity and display preferences" 
          />
          {activeSection === 'profile' && (
            <div className="p-6 bg-white animate-in slide-in-from-top-1 duration-200">
               <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl shadow-inner text-gray-400 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                            {settings.avatar ? (
                                <img src={settings.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                settings.username.charAt(0).toUpperCase()
                            )}
                        </div>
                        <button 
                            onClick={() => setShowAvatarModal(true)}
                            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-transform hover:scale-110"
                        >
                            <Camera size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowAvatarModal(true)}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                          {t('changeAvatar')}
                      </button>
                  </div>
                  <div className="flex-1 space-y-5">
                      <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('enterDisplayName')}</label>
                          <input 
                            type="text" 
                            value={settings.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Enter your name"
                          />
                      </div>
                      <div className="pt-2">
                          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium w-fit">
                              <LogOut size={16} />
                              <span>{t('logout')}</span>
                          </button>
                      </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* General Section */}
        <div>
          <SectionHeader 
            id="general" 
            icon={Globe} 
            title={t('general')} 
            description="Language, notifications, and appearance" 
          />
          {activeSection === 'general' && (
            <div className="p-6 bg-white animate-in slide-in-from-top-1 duration-200 space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('language')}</label>
                    <select 
                       value={settings.language}
                       onChange={(e) => handleChange('language', e.target.value as Language)}
                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-700"
                    >
                        <option value="en">English (US)</option>
                        <option value="ru">Русский</option>
                        <option value="uk">Українська</option>
                    </select>
                </div>
                
                <div className="space-y-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('notifications')}</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
                                <Smartphone size={18} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{t('pushNotifs')}</div>
                                <div className="text-xs text-gray-500">Receive daily motivation and updates</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('notifications', 'push')}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${settings.notifications.push ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.notifications.push ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
                                <Bell size={18} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{t('habitReminders')}</div>
                                <div className="text-xs text-gray-500">Get reminded to complete tasks</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('notifications', 'reminders')}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${settings.notifications.reminders ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.notifications.reminders ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* AI Personality Section */}
        <div>
          <SectionHeader 
            id="ai" 
            icon={BrainCircuit} 
            title={t('aiPersonality')} 
            description="Customize how your coach interacts with you" 
          />
          {activeSection === 'ai' && (
            <div className="p-6 bg-white animate-in slide-in-from-top-1 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {['coach', 'friend', 'analytical'].map((type) => (
                         <button
                            key={type}
                            onClick={() => handleAIChange('personality', type)}
                            className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                                settings.aiConfig.personality === type 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                         >
                             <div className="relative z-10">
                                <div className="font-semibold capitalize mb-1 text-gray-800 flex items-center gap-2">
                                    {type}
                                    {settings.aiConfig.personality === type && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </div>
                                <div className="text-xs text-gray-500 leading-relaxed">
                                    {type === 'coach' && 'Direct, motivating, and action-oriented. Pushes you to do better.'}
                                    {type === 'friend' && 'Warm, casual, and supportive. Celebrates small wins with you.'}
                                    {type === 'analytical' && 'Data-driven, concise, and objective. Focuses on stats and trends.'}
                                </div>
                             </div>
                         </button>
                     ))}
                </div>
            </div>
          )}
        </div>

        {/* Privacy & Data Section */}
        <div>
          <SectionHeader 
            id="privacy" 
            icon={Shield} 
            title={t('privacy')} 
            description="Manage your data and exports" 
          />
          {activeSection === 'privacy' && (
            <div className="p-6 bg-white animate-in slide-in-from-top-1 duration-200 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Anonymous Analytics</h4>
                        <p className="text-xs text-gray-500">Share anonymous usage data to help us improve.</p>
                    </div>
                    <button 
                        onClick={() => handleToggle('privacy', 'dataCollection')}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${settings.privacy.dataCollection ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                         <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.privacy.dataCollection ? 'translate-x-5' : ''}`}></div>
                    </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Management</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={onExportData}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors flex-1 border border-gray-200 hover:border-gray-300 font-medium text-sm"
                        >
                            <Download size={18} />
                            <span>{t('exportData')}</span>
                        </button>
                        <button 
                          onClick={onResetData}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex-1 border border-red-100 hover:border-red-200 font-medium text-sm"
                        >
                            <Trash2 size={18} />
                            <span>{t('resetApp')}</span>
                        </button>
                    </div>
                </div>
            </div>
          )}
        </div>

      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{t('changeAvatar')}</h3>
                <button onClick={handleCancelAvatar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
             </div>
             
             <div className="p-6 space-y-6">
                {/* Preview Area */}
                <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                        {previewAvatar ? (
                           <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover animate-in fade-in" />
                        ) : (
                           settings.avatar ? <img src={settings.avatar} alt="Current" className="w-full h-full object-cover opacity-50 grayscale" /> :
                           <div className="text-4xl text-gray-300">{settings.username.charAt(0).toUpperCase()}</div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all text-gray-400 hover:text-primary"
                    >
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-sm font-medium">{t('uploadPhoto')}</span>
                        <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                    />
                    </div>
                </div>
             </div>

             <div className="p-6 pt-0 flex gap-3">
                 <button 
                   onClick={handleCancelAvatar}
                   className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                 >
                    {previewAvatar ? t('tryAgain') : t('skip')}
                 </button>
                 <button 
                   onClick={handleSaveAvatar}
                   disabled={!previewAvatar}
                   className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                 >
                    <Check size={18} />
                    {t('save')}
                 </button>
             </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>HabitTracker AI v1.2.0</p>
        <p className="mt-1">© 2024 All rights reserved</p>
      </div>
    </div>
  );
};

export default Settings;
