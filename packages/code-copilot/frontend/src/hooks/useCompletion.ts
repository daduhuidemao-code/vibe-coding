import { useState, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getAIService } from '../services/aiService';

/**
 * 代码补全 Hook
 * 
 * @description 封装代码补全逻辑，提供获取补全建议的方法
 */
export const useCompletion = () => {
  const { settings, isConfigured } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 获取代码补全建议
   * 
   * @param {string} prompt - 代码上下文，用于生成补全建议
   * @param {string} [language] - 编程语言，用于生成更精准的补全
   * @returns {Promise<string>} AI 生成的代码补全内容
   * @throws {Error} 如果未配置 API Key 或请求失败
   */
  const getCompletion = useCallback(async (prompt: string, language?: string): Promise<string> => {
    if (!isConfigured) {
      throw new Error('请先配置 API Key');
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const aiService = getAIService(settings);
      const result = await aiService.getCompletions(prompt, language);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取补全失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [settings, isConfigured]);

  /**
   * 取消当前正在进行的补全请求
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  return { getCompletion, loading, error, cancel };
};