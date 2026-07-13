# Code Copilot

基于 Monaco Editor 的纯前端网页版 AI 代码助手，支持智能代码补全、代码解释、重构建议等功能。

## ✨ 功能特性

- **代码编辑器**：基于 Monaco Editor，支持多种编程语言语法高亮
- **AI 代码补全**：实时补全建议，按 Ctrl+Space 触发
- **AI 聊天**：与 AI 对话，获取代码解释和重构建议
- **多文件编辑**：支持创建、重命名、删除文件
- **云服务商适配**：支持 OpenAI、阿里云通义千问、腾讯云混元、字节跳动火山引擎
- **深色主题**：支持 Dark Mode
- **本地存储**：所有数据存储在浏览器 localStorage 中

## 🛠 技术栈

| 组件 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 代码编辑器 | Monaco Editor |
| 构建工具 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 图标 | Lucide React |
| LLM SDK | OpenAI SDK |

## 📁 项目结构

```
packages/code-copilot/
├── frontend/
│   ├── src/
│   │   ├── components/          # UI 组件
│   │   │   ├── Header.tsx          # 顶部导航
│   │   │   ├── FilePanel.tsx       # 文件管理面板
│   │   │   ├── MonacoEditor.tsx    # Monaco 编辑器
│   │   │   ├── ChatPanel.tsx       # AI 聊天面板
│   │   │   └── SettingsPanel.tsx   # 设置面板
│   │   ├── services/            # API 服务
│   │   │   ├── aiService.ts        # AI 服务客户端
│   │   │   └── providers.ts        # 云服务商配置
│   │   ├── context/             # React Context
│   │   │   ├── SessionContext.tsx  # 会话状态管理
│   │   │   └── SettingsContext.tsx # 设置状态管理
│   │   ├── hooks/               # 自定义 Hooks
│   │   │   ├── useCompletion.ts    # 代码补全 Hook
│   │   │   └── useChat.ts          # 聊天 Hook
│   │   ├── types/               # TypeScript 类型定义
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
├── docs/
│   ├── prd.md
│   └── architecture.md
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js 18+

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001

### 构建生产版本

```bash
npm run build
```

## ⚙️ 配置说明

### API Key 配置

1. 点击右上角设置按钮
2. 选择云服务商（OpenAI / 阿里云 / 腾讯云 / 字节跳动 / 自定义）
3. 输入 API Key
4. 选择模型

### 支持的云服务商

| 云服务商 | 模型 |
|----------|------|
| OpenAI | gpt-4o, gpt-4, gpt-4-turbo, gpt-3.5-turbo |
| 阿里云通义千问 | qwen-turbo, qwen-plus, qwen-max |
| 腾讯云混元 | hunyuan-pro, hunyuan-standard |
| 字节跳动火山引擎 | doubao-3-5 |
| 自定义 API | 兼容 OpenAI 格式 |

## 🎯 使用方式

### 代码补全

1. 在编辑器中输入代码
2. 按 `Ctrl+Space` 触发 AI 补全
3. 按 `Tab` 接受补全建议

### AI 聊天

1. 在右侧聊天面板输入问题
2. AI 会根据当前文件内容提供回答
3. 支持代码块显示和复制

### 文件管理

1. 点击左侧文件面板的 "+" 按钮新建文件
2. 右键点击文件可重命名或删除
3. 点击文件名切换当前编辑文件

## 🔐 安全说明

- API Key 仅存储在浏览器 localStorage 中
- 前端直接调用云服务商 API，无需经过中间服务器
- 建议使用限额 API Key 以确保安全

## 📄 许可证

MIT License