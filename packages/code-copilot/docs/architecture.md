# 网页版 Copilot - 技术架构文档

## 1. Architecture Design

```mermaid
flowchart TB
    subgraph Frontend (Browser)
        A[React App]
        B[Monaco Editor]
        C[AI Chat Panel]
        D[File Manager]
        E[Settings Panel]
        F[AI Service Client]
        G[localStorage]
    end

    subgraph Cloud Services
        H[OpenAI API]
        I[阿里云通义千问]
        J[腾讯云混元]
        K[字节跳动火山引擎]
        L[自定义 API]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    F --> H
    F --> I
    F --> J
    F --> K
    F --> L
```

## 2. Technology Description

| 组件 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | React | 18.x | UI 组件开发 |
| 代码编辑器 | Monaco Editor | 0.46.x | 代码编辑核心 |
| 构建工具 | Vite | 5.x | 快速构建 |
| 样式 | Tailwind CSS | 3.x | 响应式样式 |
| 图标 | Lucide React | 0.x | UI 图标 |
| 状态管理 | React Context | - | 全局状态管理 |
| LLM SDK | openai | 1.x | OpenAI API 调用 |

## 3. Route Definitions

| Route | Purpose |
|-------|---------|
| / | 代码编辑器主页面 |
| /settings | 设置页面 |

## 4. API Definitions

### 4.1 AI Service Client

前端直接调用云服务商 API，无需后端中转。

```typescript
interface CloudProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyHeader: string;
  models: string[];
}

interface AppSettings {
  provider: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  theme: string;
  fontSize: number;
}

interface AIService {
  getCompletions(request: CompletionRequest): Promise<CompletionResponse>;
  getChatResponse(request: ChatRequest): Promise<ChatResponse>;
  getChatStream(request: ChatRequest): Promise<ReadableStream>;
}

interface CompletionRequest {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
}

interface CompletionResponse {
  id: string;
  choices: {
    text: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ChatRequest {
  model: string;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  stream?: boolean;
}

interface ChatResponse {
  id: string;
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
  }[];
}
```

## 5. Data Model

### 5.1 会话状态

```typescript
interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface Session {
  id: string;
  files: File[];
  currentFileId: string;
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AppSettings {
  provider: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  theme: string;
  fontSize: number;
}
```

### 5.2 localStorage 存储结构

```typescript
interface LocalStorageData {
  settings: AppSettings;
  session: Session;
  chatHistory: ChatMessage[];
}
```

## 6. 项目目录结构

```
packages/code-copilot/
├── frontend/                   # 前端代码（纯前端实现）
│   ├── src/
│   │   ├── components/         # UI 组件
│   │   │   ├── MonacoEditor.tsx    # Monaco 编辑器组件
│   │   │   ├── ChatPanel.tsx       # 聊天面板组件
│   │   │   ├── FilePanel.tsx       # 文件管理面板
│   │   │   ├── Header.tsx          # 顶部导航
│   │   │   └── SettingsPanel.tsx   # 设置面板
│   │   ├── services/           # API 服务
│   │   │   ├── aiService.ts        # AI 服务客户端（直接调用云服务商 API）
│   │   │   └── providers.ts        # 云服务商配置
│   │   ├── context/            # React Context
│   │   │   ├── SessionContext.tsx  # 会话状态管理
│   │   │   └── SettingsContext.tsx # 设置状态管理
│   │   ├── hooks/              # 自定义 Hooks
│   │   │   ├── useCompletion.ts    # 代码补全 Hook
│   │   │   └── useChat.ts          # 聊天 Hook
│   │   ├── types/              # TypeScript 类型定义
│   │   │   └── index.ts
│   │   ├── App.tsx             # 主应用组件
│   │   └── main.tsx            # 入口文件
│   ├── package.json            # 前端依赖
│   ├── vite.config.ts          # Vite 配置
│   ├── tsconfig.json           # TypeScript 配置
│   └── tailwind.config.js      # Tailwind 配置
├── docs/                       # 文档
│   ├── prd.md                  # PRD 文档
│   └── architecture.md         # 技术架构文档
└── README.md                   # 项目说明
```

## 7. 关键实现细节

### 7.1 Monaco Editor 集成

- 使用 `@monaco-editor/react` 封装 Monaco Editor
- 配置语言支持（JavaScript、TypeScript、Python、Java、Go 等）
- 实现自定义补全提供器，调用 AI API 获取补全建议
- 支持代码格式化、语法高亮、错误提示

### 7.2 AI 代码补全

- 监听编辑器输入事件
- 提取上下文（当前文件内容、光标位置、前几行代码）
- 从 localStorage 读取 API Key 和模型配置
- 前端直接调用云服务商 API
- 在编辑器中以灰色占位符形式显示补全内容
- 支持 Tab 键接受补全

### 7.3 AI 聊天功能

- 使用流式响应（Server-Sent Events）实现实时对话
- 支持 Markdown 渲染，代码块使用 Monaco Editor 样式
- 支持选择代码片段发送给 AI
- 支持一键应用 AI 建议的代码修改

### 7.4 云服务商适配

- 支持多种云服务商：OpenAI、阿里云、腾讯云、字节跳动
- 统一 API 调用接口，根据配置自动选择服务商
- 自定义 API 支持：用户可配置兼容 OpenAI 格式的自定义 API

### 7.5 会话管理

- 使用 localStorage 保存会话状态
- 支持多文件编辑
- 支持文件的新建、重命名、删除操作

### 7.6 安全考虑

- API Key 仅存储在浏览器 localStorage 中，不发送到任何服务器
- 前端直接调用云服务商 API，无需经过中间服务器
- 支持自定义 API 端点，用户可选择自己信任的服务

## 8. 云服务商配置

### 8.1 OpenAI

```typescript
{
  id: 'openai',
  name: 'OpenAI',
  baseUrl: 'https://api.openai.com/v1',
  apiKeyHeader: 'Authorization',
  apiKeyPrefix: 'Bearer ',
  models: ['gpt-4o', 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
}
```

### 8.2 阿里云通义千问

```typescript
{
  id: 'aliyun',
  name: '阿里云通义千问',
  baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
  apiKeyHeader: 'Authorization',
  apiKeyPrefix: 'Bearer ',
  models: ['qwen-turbo', 'qwen-plus', 'qwen-max']
}
```

### 8.3 腾讯云混元大模型

```typescript
{
  id: 'tencent',
  name: '腾讯云混元',
  baseUrl: 'https://hunyuan.tencentcloudapi.com',
  apiKeyHeader: 'Authorization',
  apiKeyPrefix: '',
  models: ['hunyuan-pro', 'hunyuan-standard']
}
```

### 8.4 自定义 API

```typescript
{
  id: 'custom',
  name: '自定义 API',
  baseUrl: '', // 用户配置
  apiKeyHeader: '', // 用户配置
  apiKeyPrefix: '', // 用户配置
  models: [] // 用户配置
}
```

## 9. 开发流程

1. **环境准备**：安装 Node.js 18+
2. **安装依赖**：`cd frontend && npm install`
3. **启动开发服务器**：`npm run dev`
4. **配置 API Key**：在设置面板中配置云服务商 API Key
5. **开始使用**：在编辑器中输入代码，体验 AI 补全功能

## 10. 部署方案

### 10.1 静态部署

- 构建前端：`npm run build`
- 将 `dist` 目录部署到任意静态文件服务器（Nginx、Vercel、Netlify、GitHub Pages）
- 无需后端服务

### 10.2 Vercel 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

### 10.3 GitHub Pages 部署

```bash
# 构建
npm run build

# 部署到 gh-pages 分支
npm install gh-pages --save-dev
npx gh-pages -d dist
```