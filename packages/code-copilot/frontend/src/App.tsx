import { useState } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/Header';
import { FilePanel } from './components/FilePanel';
import { MonacoEditor } from './components/MonacoEditor';
import { ChatPanel } from './components/ChatPanel';
import { SettingsPanel } from './components/SettingsPanel';

/**
 * AppContent 组件
 *
 * @description 主应用内容组件，包含布局结构和各子组件的组合
 */
function AppContent() {
  /** 设置面板显示状态 */
  const [showSettings, setShowSettings] = useState(false);
  const { setShowNewFileModal } = useSession();

  /**
   * 处理新建文件按钮点击
   */
  const handleNewFile = () => {
    setShowNewFileModal(true);
  };

  /**
   * 处理保存按钮点击
   */
  const handleSave = () => {
    console.log('保存');
  };

  return (
    <div className="h-screen flex flex-col bg-dark-900 text-white">
      <Header
        onNewFile={handleNewFile}
        onSave={handleSave}
        onOpenSettings={() => setShowSettings(true)}
      />
      <div className="flex-1 flex overflow-hidden">
        <FilePanel />
        <MonacoEditor />
        <ChatPanel />
      </div>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}

/**
 * App 组件
 *
 * @description 根组件，提供 SettingsProvider 和 SessionProvider 上下文，包裹 AppContent 组件
 */
function App() {
  return (
    <SettingsProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </SettingsProvider>
  );
}

export default App;
