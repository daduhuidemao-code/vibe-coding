import { useState, useCallback, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getAIService } from '../services/aiService';
import { ChatMessage } from '../types';

/**
 * 聊天 Hook
 * 
 * @description 封装 AI 聊天逻辑，支持流式响应
 */
export const useChat = () => {
  const { settings, isConfigured } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 发送聊天消息并获取流式响应
   * 
   * @param {{ role: 'user' | 'assistant' | 'system'; content: string }[]} messages - 消息列表
   * @param {(token: string) => void} onToken - 收到 token 时的回调函数
   * @returns {Promise<void>}
   * @throws {Error} 如果未配置 API Key 或请求失败
   */
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

  /**
   * 取消当前正在进行的聊天请求
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  return { sendMessage, loading, error, cancel };
};

/**
 * 创建系统消息
 * 
 * @param {string} content - 系统消息内容
 * @returns {ChatMessage} 系统消息对象
 */
export const createSystemMessage = (content: string): ChatMessage => ({
  id: 'system',
  role: 'assistant',
  content,
  timestamp: new Date()
});