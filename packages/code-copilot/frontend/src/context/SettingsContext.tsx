import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const defaultSettings: AppSettings = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2048,
  theme: 'dark',
  fontSize: 14,
  customBaseUrl: '',
  customModels: []
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('code-copilot-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('code-copilot-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.className = settings.theme === 'dark' ? 'dark' : '';
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const isConfigured = !!settings.apiKey;

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      isConfigured
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};