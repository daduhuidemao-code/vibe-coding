import { useState } from 'react';
import { SessionProvider } from './context/SessionContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/Header';
import { FilePanel } from './components/FilePanel';
import { MonacoEditor } from './components/MonacoEditor';
import { ChatPanel } from './components/ChatPanel';
import { SettingsPanel } from './components/SettingsPanel';

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);

  const handleNewFile = () => {
    console.log('新建文件');
  };

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
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

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