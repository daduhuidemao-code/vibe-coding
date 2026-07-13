import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { File, Session, ChatMessage } from '../types';

/**
 * SessionContext 类型定义
 */
interface SessionContextType {
  session: Session;
  chatHistory: ChatMessage[];
  currentFile: File | null;
  showNewFileModal: boolean;
  addFile: (name: string, content: string, language: string) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, content: string) => void;
  renameFile: (id: string, newName: string) => void;
  setCurrentFile: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  setShowNewFileModal: (show: boolean) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

/**
 * 默认会话配置
 */
const defaultSession: Session = {
  id: 'default',
  files: [
    {
      id: '1',
      name: 'main.ts',
      content:
        '// 在此开始编写代码\n\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconst message = greet("World");\nconsole.log(message);',
      language: 'typescript',
    },
  ],
  currentFileId: '1',
  createdAt: new Date(),
};

/**
 * 默认聊天历史
 */
const defaultChatHistory: ChatMessage[] = [];

/**
 * SessionProvider 组件
 *
 * @description 提供会话状态管理，包括文件列表、当前文件、聊天历史等
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 子组件
 */
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  /**
   * 从 localStorage 加载会话状态，如果没有则使用默认值
   */
  const [session, setSession] = useState<Session>(() => {
    const saved = localStorage.getItem('code-copilot-session');
    return saved ? JSON.parse(saved) : defaultSession;
  });

  /**
   * 从 localStorage 加载聊天历史，如果没有则使用默认值
   */
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('code-copilot-chat-history');
    return saved ? JSON.parse(saved) : defaultChatHistory;
  });

  /**
   * 新建文件弹窗显示状态
   */
  const [showNewFileModal, setShowNewFileModal] = useState(false);

  /**
   * 当会话状态变化时，保存到 localStorage
   */
  useEffect(() => {
    localStorage.setItem('code-copilot-session', JSON.stringify(session));
  }, [session]);

  /**
   * 当聊天历史变化时，保存到 localStorage
   */
  useEffect(() => {
    localStorage.setItem('code-copilot-chat-history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  /**
   * 当前编辑的文件
   */
  const currentFile = session.files.find((f) => f.id === session.currentFileId) || null;

  /**
   * 添加新文件
   *
   * @param {string} name - 文件名
   * @param {string} content - 文件内容
   * @param {string} language - 编程语言
   */
  const addFile = (name: string, content: string, language: string) => {
    const newFile: File = {
      id: Date.now().toString(),
      name,
      content,
      language,
    };
    setSession((prev) => ({
      ...prev,
      files: [...prev.files, newFile],
      currentFileId: newFile.id,
    }));
  };

  /**
   * 删除文件
   *
   * @param {string} id - 文件 ID
   */
  const deleteFile = (id: string) => {
    setSession((prev) => {
      const newFiles = prev.files.filter((f) => f.id !== id);
      const newCurrentId = prev.currentFileId === id ? newFiles[0]?.id || '' : prev.currentFileId;
      return {
        ...prev,
        files: newFiles,
        currentFileId: newCurrentId,
      };
    });
  };

  /**
   * 更新文件内容
   *
   * @param {string} id - 文件 ID
   * @param {string} content - 新的文件内容
   */
  const updateFile = (id: string, content: string) => {
    setSession((prev) => ({
      ...prev,
      files: prev.files.map((f) => (f.id === id ? { ...f, content } : f)),
    }));
  };

  /**
   * 重命名文件
   *
   * @param {string} id - 文件 ID
   * @param {string} newName - 新文件名
   */
  const renameFile = (id: string, newName: string) => {
    setSession((prev) => ({
      ...prev,
      files: prev.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    }));
  };

  /**
   * 设置当前编辑的文件
   *
   * @param {string} id - 文件 ID
   */
  const setCurrentFile = (id: string) => {
    setSession((prev) => ({
      ...prev,
      currentFileId: id,
    }));
  };

  /**
   * 添加聊天消息
   *
   * @param {ChatMessage} message - 聊天消息
   */
  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  /**
   * 清空聊天历史
   */
  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        chatHistory,
        currentFile,
        showNewFileModal,
        addFile,
        deleteFile,
        updateFile,
        renameFile,
        setCurrentFile,
        addChatMessage,
        clearChatHistory,
        setShowNewFileModal,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

/**
 * useSession Hook
 *
 * @description 获取会话上下文
 * @returns {SessionContextType} 会话上下文
 * @throws {Error} 如果在 SessionProvider 外部调用
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
