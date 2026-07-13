import { useState } from 'react';
import { FileCode, Folder, Plus, Trash2, Edit3, ChevronRight } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const FilePanel = () => {
  const { session, currentFile, setCurrentFile, addFile, deleteFile, renameFile } = useSession();
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('typescript');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  const languages = [
    { id: 'typescript', name: 'TypeScript' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'go', name: 'Go' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' },
    { id: 'rust', name: 'Rust' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'sql', name: 'SQL' },
    { id: 'json', name: 'JSON' },
    { id: 'yaml', name: 'YAML' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' }
  ];

  const handleNewFile = () => {
    if (!newFileName.trim()) return;
    const ext = languages.find(l => l.id === newFileLanguage)?.id || 'ts';
    const name = newFileName.includes('.') ? newFileName : `${newFileName}.${ext}`;
    addFile(name, '', newFileLanguage);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const handleRename = (id: string) => {
    if (!renameName.trim()) return;
    renameFile(id, renameName);
    setRenameName('');
    setRenamingId(null);
  };

  return (
    <div className="w-64 bg-dark-900 border-r border-dark-700 flex flex-col">
      <div className="p-3 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-dark-400">
            <Folder className="w-4 h-4" />
            <span className="text-sm font-medium">文件</span>
          </div>
          <button
            onClick={() => setShowNewFileModal(true)}
            className="p-1 text-dark-500 hover:text-white hover:bg-dark-700 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {session.files.map(file => (
            <div
              key={file.id}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                currentFile?.id === file.id
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-white'
              }`}
              onClick={() => setCurrentFile(file.id)}
            >
              <ChevronRight className="w-3 h-3" />
              <FileCode className="w-4 h-4" />
              {renamingId === file.id ? (
                <input
                  type="text"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  onBlur={() => handleRename(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(file.id);
                    if (e.key === 'Escape') setRenamingId(null);
                  }}
                  className="flex-1 bg-dark-600 border border-dark-500 rounded px-2 py-0.5 text-sm outline-none"
                  autoFocus
                />
              ) : (
                <span className="flex-1 text-sm truncate">{file.name}</span>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(file.id);
                    setRenameName(file.name);
                  }}
                  className="p-1 hover:text-white hover:bg-dark-600 rounded"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  className="p-1 hover:text-red-400 hover:bg-dark-600 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewFileModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 w-80">
            <h3 className="text-white font-medium mb-4">新建文件</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-dark-400 text-sm mb-1">文件名</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="例如: main.ts"
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-500 outline-none focus:border-accent-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-dark-400 text-sm mb-1">语言</label>
                <select
                  value={newFileLanguage}
                  onChange={(e) => setNewFileLanguage(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-accent-500"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewFileModal(false)}
                  className="flex-1 px-4 py-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleNewFile}
                  className="flex-1 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};