import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings } from '../types';

/**
 * SettingsContext 类型定义
 */
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

/**
 * 默认应用设置
 */
const defaultSettings: AppSettings = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2048,
  theme: 'dark',
  fontSize: 14,
  customBaseUrl: '',
  customModels: [],
};

/**
 * SettingsProvider 组件
 *
 * @description 提供应用设置状态管理，包括 API Key、模型配置、编辑器设置等
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 子组件
 */
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  /**
   * 从 localStorage 加载应用设置，如果没有则使用默认值
   */
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('code-copilot-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  /**
   * 当设置变化时，保存到 localStorage
   */
  useEffect(() => {
    localStorage.setItem('code-copilot-settings', JSON.stringify(settings));
  }, [settings]);

  /**
   * 当主题变化时，更新 document 的 class 以应用深色/浅色主题
   */
  useEffect(() => {
    document.documentElement.className = settings.theme === 'dark' ? 'dark' : '';
  }, [settings.theme]);

  /**
   * 更新应用设置
   *
   * @param {Partial<AppSettings>} newSettings - 新的设置（部分更新）
   */
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  /**
   * 是否已配置 API Key
   *
   * @type {boolean}
   */
  const isConfigured = !!settings.apiKey;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isConfigured,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * useSettings Hook
 *
 * @description 获取应用设置上下文
 * @returns {SettingsContextType} 设置上下文
 * @throws {Error} 如果在 SettingsProvider 外部调用
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
