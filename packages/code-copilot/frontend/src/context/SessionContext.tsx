import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { File, Session, ChatMessage } from '../types';

interface SessionContextType {
  session: Session;
  chatHistory: ChatMessage[];
  currentFile: File | null;
  addFile: (name: string, content: string, language: string) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, content: string) => void;
  renameFile: (id: string, newName: string) => void;
  setCurrentFile: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

const defaultSession: Session = {
  id: 'default',
  files: [
    {
      id: '1',
      name: 'main.ts',
      content: '// 在此开始编写代码\n\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconst message = greet("World");\nconsole.log(message);',
      language: 'typescript'
    }
  ],
  currentFileId: '1',
  createdAt: new Date()
};

const defaultChatHistory: ChatMessage[] = [];

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>(() => {
    const saved = localStorage.getItem('code-copilot-session');
    return saved ? JSON.parse(saved) : defaultSession;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('code-copilot-chat-history');
    return saved ? JSON.parse(saved) : defaultChatHistory;
  });

  useEffect(() => {
    localStorage.setItem('code-copilot-session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('code-copilot-chat-history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const currentFile = session.files.find(f => f.id === session.currentFileId) || null;

  const addFile = (name: string, content: string, language: string) => {
    const newFile: File = {
      id: Date.now().toString(),
      name,
      content,
      language
    };
    setSession(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      currentFileId: newFile.id
    }));
  };

  const deleteFile = (id: string) => {
    setSession(prev => {
      const newFiles = prev.files.filter(f => f.id !== id);
      const newCurrentId = prev.currentFileId === id 
        ? newFiles[0]?.id || '' 
        : prev.currentFileId;
      return {
        ...prev,
        files: newFiles,
        currentFileId: newCurrentId
      };
    });
  };

  const updateFile = (id: string, content: string) => {
    setSession(prev => ({
      ...prev,
      files: prev.files.map(f => 
        f.id === id ? { ...f, content } : f
      )
    }));
  };

  const renameFile = (id: string, newName: string) => {
    setSession(prev => ({
      ...prev,
      files: prev.files.map(f => 
        f.id === id ? { ...f, name: newName } : f
      )
    }));
  };

  const setCurrentFile = (id: string) => {
    setSession(prev => ({
      ...prev,
      currentFileId: id
    }));
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <SessionContext.Provider value={{
      session,
      chatHistory,
      currentFile,
      addFile,
      deleteFile,
      updateFile,
      renameFile,
      setCurrentFile,
      addChatMessage,
      clearChatHistory
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};