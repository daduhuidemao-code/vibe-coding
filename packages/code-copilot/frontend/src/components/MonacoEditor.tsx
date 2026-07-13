import { useEffect, useCallback, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useSession } from '../context/SessionContext';
import { useSettings } from '../context/SettingsContext';
import { getAIService } from '../services/aiService';

/**
 * MonacoEditor 组件
 * 
 * @description 集成 Monaco Editor 的代码编辑器组件，支持语法高亮、AI 代码补全、主题切换、字体大小调整等功能
 */
export const MonacoEditor = () => {
  const { currentFile, updateFile } = useSession();
  const { settings, isConfigured } = useSettings();
  const monaco = useMonaco();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 注册 AI 代码补全提供器
   * 
   * @description 当 Monaco Editor 初始化完成后，注册自定义代码补全提供器，支持多种编程语言
   */
  useEffect(() => {
    if (!monaco) return;

    const provider: monaco.languages.CompletionItemProvider = {
      provideCompletionItems: async (model, position) => {
        if (!isConfigured) return { suggestions: [] };

        /**
         * 获取光标前的代码上下文
         */
        const textBeforeCursor = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        const language = model.getLanguageId();

        try {
          /**
           * 调用 AI 服务获取代码补全建议
           */
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

    /**
     * 支持的编程语言列表
     */
    const languages = ['typescript', 'javascript', 'python', 'java', 'go', 'cpp', 'csharp', 'rust', 'php', 'ruby'];
    languages.forEach(lang => {
      monaco.languages.registerCompletionItemProvider(lang, provider);
    });

    /**
     * 清理函数：移除代码补全提供器
     */
    return () => {
      languages.forEach(lang => {
        monaco.languages.registerCompletionItemProvider(lang, {
          provideCompletionItems: () => ({ suggestions: [] })
        });
      });
    };
  }, [monaco, settings, isConfigured]);

  /**
   * 处理编辑器内容变化（防抖）
   * 
   * @param {string | undefined} value - 编辑器内容
   */
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

  /**
   * 组件卸载时清理定时器
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * 如果没有当前文件，显示提示信息
   */
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