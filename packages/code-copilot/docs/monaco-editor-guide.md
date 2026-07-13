# Monaco Editor 学习指南

## 1. 简介

Monaco Editor 是 Microsoft 开发的一款强大的代码编辑器，VS Code 就是基于它构建的。它提供了丰富的功能，包括语法高亮、代码补全、代码格式化、错误提示等。

## 2. 安装与集成

### 2.1 安装依赖

```bash
npm install monaco-editor @monaco-editor/react
```

### 2.2 基础用法

```tsx
import Editor from '@monaco-editor/react';

function MyEditor() {
  const handleChange = (value: string | undefined) => {
    console.log('Editor value:', value);
  };

  return (
    <Editor
      height="500px"
      language="typescript"
      theme="vs-dark"
      value="// 在此编写代码"
      onChange={handleChange}
    />
  );
}
```

## 3. 核心概念

### 3.1 Editor 实例

通过 `useMonaco` hook 可以获取 Monaco Editor 的实例：

```tsx
import { useMonaco } from '@monaco-editor/react';

function MyEditor() {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    
    // 使用 monaco API
    const editor = monaco.editor.create(document.getElementById('container'), {
      value: '// code',
      language: 'typescript'
    });
  }, [monaco]);

  return <div id="container" />;
}
```

### 3.2 语言支持

Monaco Editor 支持多种编程语言，通过 `language` 属性指定：

```tsx
<Editor
  language="typescript" // javascript, python, java, go, cpp, csharp, rust, php, ruby, sql, json, yaml, html, css
/>
```

### 3.3 主题

支持多种主题，通过 `theme` 属性指定：

```tsx
<Editor
  theme="vs-dark" // vs-dark, light, hc-black
/>
```

## 4. 高级功能

### 4.1 自定义代码补全

```tsx
useEffect(() => {
  if (!monaco) return;

  const provider: monaco.languages.CompletionItemProvider = {
    provideCompletionItems: async (model, position) => {
      const text = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      const suggestions = [
        {
          label: 'AI 补全',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '// AI generated code',
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          }
        }
      ];

      return { suggestions };
    }
  };

  monaco.languages.registerCompletionItemProvider('typescript', provider);
}, [monaco]);
```

### 4.2 编辑器选项

```tsx
<Editor
  options={{
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
    minimap: { enabled: true },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'line',
    cursorBlinking: 'smooth',
    bracketPairColorization: { enabled: true },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on'
  }}
/>
```

### 4.3 获取编辑器实例

```tsx
import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

function MyEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const getCurrentValue = () => {
    return editorRef.current?.getValue();
  };

  return <Editor onMount={handleEditorMount} />;
}
```

### 4.4 监听事件

```tsx
useEffect(() => {
  if (!monaco || !editorRef.current) return;

  const editor = editorRef.current;

  // 监听内容变化
  const model = editor.getModel();
  if (model) {
    const disposable = model.onDidChangeContent((event) => {
      console.log('Content changed:', event);
    });

    return () => disposable.dispose();
  }
}, [monaco]);
```

## 5. 常用 API

### 5.1 Editor API

| 方法 | 说明 |
|------|------|
| `editor.getValue()` | 获取编辑器内容 |
| `editor.setValue(value)` | 设置编辑器内容 |
| `editor.getSelection()` | 获取选区 |
| `editor.setSelection(selection)` | 设置选区 |
| `editor.focus()` | 聚焦编辑器 |
| `editor.getModel()` | 获取当前模型 |
| `editor.setModel(model)` | 设置模型 |

### 5.2 Model API

| 方法 | 说明 |
|------|------|
| `model.getValue()` | 获取模型内容 |
| `model.setValue(value)` | 设置模型内容 |
| `model.getLanguageId()` | 获取语言 ID |
| `model.getLineCount()` | 获取行数 |
| `model.getValueInRange(range)` | 获取指定范围的内容 |
| `model.onDidChangeContent(callback)` | 监听内容变化 |

### 5.3 Languages API

| 方法 | 说明 |
|------|------|
| `monaco.languages.registerCompletionItemProvider(language, provider)` | 注册代码补全提供器 |
| `monaco.languages.registerHoverProvider(language, provider)` | 注册悬停提示提供器 |
| `monaco.languages.registerDocumentSymbolProvider(language, provider)` | 注册文档符号提供器 |

## 6. 性能优化

### 6.1 避免不必要的重渲染

```tsx
const memoizedOptions = useMemo(() => ({
  fontSize: settings.fontSize,
  theme: settings.theme
}), [settings.fontSize, settings.theme]);

<Editor options={memoizedOptions} />
```

### 6.2 防抖处理

```tsx
const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleChange = (value: string | undefined) => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }
  debounceTimerRef.current = setTimeout(() => {
    updateFile(value);
  }, 500);
};
```

## 7. 资源链接

- [Monaco Editor 官方文档](https://microsoft.github.io/monaco-editor/)
- [@monaco-editor/react 文档](https://github.com/suren-atoyan/monaco-react)
- [VS Code API 文档](https://code.visualstudio.com/api)
- [Monaco Editor 示例](https://microsoft.github.io/monaco-editor/playground.html)