import { Code2, Settings, Plus, Save, Moon, Sun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';

interface HeaderProps {
  onNewFile: () => void;
  onSave: () => void;
  onOpenSettings: () => void;
}

export const Header = ({ onNewFile, onSave, onOpenSettings }: HeaderProps) => {
  const { settings, updateSettings } = useSettings();
  const { currentFile } = useSession();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="h-14 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-accent-400" />
          <span className="font-bold text-white text-lg">Code Copilot</span>
        </div>
        {currentFile && (
          <span className="text-dark-600 text-sm ml-4">
            {currentFile.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewFile}
          className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">新建文件</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">保存</span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};