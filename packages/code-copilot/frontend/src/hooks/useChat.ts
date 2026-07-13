import { useState, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getAIService } from '../services/aiService';
import { ChatMessage } from '../types';

export const useChat = () => {
  const { settings, isConfigured } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    onToken: (token: string) => void
  ): Promise<void> => {
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
      const stream = aiService.getChatStream({
        model: settings.model,
        messages,
        stream: true,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens
      });

      for await (const token of stream) {
        onToken(token);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息失败';
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

  return { sendMessage, loading, error, cancel };
};

export const createSystemMessage = (content: string): ChatMessage => ({
  id: 'system',
  role: 'assistant',
  content,
  timestamp: new Date()
});