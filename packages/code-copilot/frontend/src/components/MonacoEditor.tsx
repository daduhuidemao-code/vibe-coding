import { useEffect, useCallback, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useSession } from '../context/SessionContext';
import { useSettings } from '../context/SettingsContext';
import { getAIService } from '../services/aiService';

export const MonacoEditor = () => {
  const { currentFile, updateFile } = useSession();
  const { settings, isConfigured } = useSettings();
  const monaco = useMonaco();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!monaco) return;

    const provider: monaco.languages.CompletionItemProvider = {
      provideCompletionItems: async (model, position) => {
        if (!isConfigured) return { suggestions: [] };

        const textBeforeCursor = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        const language = model.getLanguageId();

        try {
          const aiService = getAIService(settings);
          const completion = await aiService.getCompletions(textBeforeCursor, language);

          if (!completion.trim()) return { suggestions: [] };

          return {
            suggestions: [
              {
                label: 'AI 补全',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: completion,
                detail: '由 AI 生成的代码补全',
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column
                }
              }
            ]
          };
        } catch {
          return { suggestions: [] };
        }
      }
    };

    const languages = ['typescript', 'javascript', 'python', 'java', 'go', 'cpp', 'csharp', 'rust', 'php', 'ruby'];
    languages.forEach(lang => {
      monaco.languages.registerCompletionItemProvider(lang, provider);
    });

    return () => {
      languages.forEach(lang => {
        monaco.languages.registerCompletionItemProvider(lang, {
          provideCompletionItems: () => ({ suggestions: [] })
        });
      });
    };
  }, [monaco, settings, isConfigured]);

  const handleChange = useCallback((value: string | undefined) => {
    if (value !== undefined && currentFile) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        updateFile(currentFile.id, value);
      }, 500);
    }
  }, [currentFile, updateFile]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-dark-500">
        <p>请选择或创建一个文件</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Editor
        height="100%"
        language={currentFile.language}
        theme={settings.theme === 'dark' ? 'vs-dark' : 'light'}
        value={currentFile.content}
        onChange={handleChange}
        options={{
          fontSize: settings.fontSize,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          minimap: { enabled: true },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          lineNumbers: 'on',
          folding: true,
          foldingHighlight: true,
          bracketPairColorization: { enabled: true },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          suggestSelection: 'first'
        }}
      />
    </div>
  );
};