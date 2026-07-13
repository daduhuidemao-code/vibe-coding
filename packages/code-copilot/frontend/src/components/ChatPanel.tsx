import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Copy, Check } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useSettings } from '../context/SettingsContext';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../types';

/**
 * ChatPanel 组件
 * 
 * @description AI 聊天面板组件，支持发送消息、流式响应显示、Markdown 渲染、代码复制等功能
 */
export const ChatPanel = () => {
  const { chatHistory, addChatMessage, clearChatHistory, currentFile } = useSession();
  const { isConfigured } = useSettings();
  const { sendMessage, loading } = useChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 自动滚动到最新消息
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  /**
   * 发送消息处理函数
   * 
   * @description 将用户消息添加到聊天历史，构建包含当前文件上下文的消息列表，调用 AI 服务获取响应
   */
  const handleSend = async () => {
    if (!input.trim() || !isConfigured) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    addChatMessage(userMessage);

    setInput('');
    setIsTyping(true);

    /**
     * 构建消息列表，包含历史消息和当前用户消息
     */
    const messages = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    messages.push({ role: 'user', content: input });

    /**
     * 如果有当前文件，在消息开头添加系统消息，包含文件信息
     */
    if (currentFile) {
      messages.unshift({
        role: 'system',
        content: `用户正在编辑文件: ${currentFile.name}\n文件内容:\n\`\`\`${currentFile.language}\n${currentFile.content}\n\`\`\``
      });
    }

    try {
      let assistantContent = '';
      await sendMessage(messages, (token) => {
        assistantContent += token;
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };
      addChatMessage(assistantMessage);
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * 键盘事件处理（Enter 发送消息）
   * 
   * @param {React.KeyboardEvent} e - 键盘事件
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * 复制消息内容到剪贴板
   * 
   * @param {string} content - 要复制的内容
   * @param {string} id - 消息 ID（用于显示复制成功状态）
   */
  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * 格式化消息内容（简单的 Markdown 渲染）
   * 
   * @param {string} content - 原始内容
   * @returns {string} 格式化后的 HTML
   */
  const formatContent = (content: string) => {
    return content
      .replace(/```(\w+)?\n/g, '<pre><code class="language-$1">')
      .replace(/```/g, '</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="w-80 bg-dark-800 border-l border-dark-700 flex flex-col">
      <div className="p-3 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-accent-400" />
          <span className="text-white text-sm font-medium">AI 助手</span>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={clearChatHistory}
            className="p-1 text-dark-500 hover:text-red-400 hover:bg-dark-700 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatHistory.length === 0 ? (
          <div className="text-center text-dark-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">输入问题，AI 助手将为您解答</p>
            {!isConfigured && (
              <p className="text-xs mt-2 text-red-400">请先配置 API Key</p>
            )}
          </div>
        ) : (
          chatHistory.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-lg ${
                msg.role === 'user' ? 'bg-accent-500/20' : 'bg-dark-700'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-dark-400" />
                ) : (
                  <Bot className="w-4 h-4 text-accent-400" />
                )}
              </div>
              <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block p-3 rounded-lg max-w-full ${
                    msg.role === 'user'
                      ? 'bg-accent-500 text-white'
                      : 'bg-dark-700 text-dark-200'
                  }`}
                >
                  <div
                    className="markdown-body text-sm"
                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                  />
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="ml-2 mt-1 p-1 text-dark-500 hover:text-white hover:bg-dark-700 rounded transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex gap-2">
            <div className="p-2 rounded-lg bg-dark-700">
              <Bot className="w-4 h-4 text-accent-400" />
            </div>
            <div className="bg-dark-700 text-dark-200 p-3 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-dark-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConfigured ? '输入问题...' : '请先配置 API Key'}
            disabled={!isConfigured}
            className={`flex-1 bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-500 outline-none focus:border-accent-500 transition-colors ${
              !isConfigured ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConfigured || loading}
            className={`p-2 rounded-lg transition-colors ${
              input.trim() && isConfigured && !loading
                ? 'bg-accent-500 text-white hover:bg-accent-600'
                : 'bg-dark-700 text-dark-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};