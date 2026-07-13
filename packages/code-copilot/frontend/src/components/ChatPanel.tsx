import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Copy, Check } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useSettings } from '../context/SettingsContext';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../types';

export const ChatPanel = () => {
  const { chatHistory, addChatMessage, clearChatHistory, currentFile } = useSession();
  const { isConfigured } = useSettings();
  const { sendMessage, loading } = useChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

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

    const messages = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    messages.push({ role: 'user', content: input });

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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