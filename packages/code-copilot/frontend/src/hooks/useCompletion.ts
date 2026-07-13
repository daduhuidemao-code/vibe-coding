import { useState, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getAIService } from '../services/aiService';

export const useCompletion = () => {
  const { settings, isConfigured } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  return { getCompletion, loading, error, cancel };
};