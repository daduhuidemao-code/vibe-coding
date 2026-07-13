# Code Copilot 项目学习指南

## 1. 项目概览

Code Copilot 是一个基于 Monaco Editor 的纯前端网页版 AI 代码助手，支持智能代码补全、代码解释、重构建议等功能。

### 1.1 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.x |
| 代码编辑器 | Monaco Editor | 0.46.x |
| 构建工具 | Vite | 5.x |
| 样式 | Tailwind CSS | 3.x |
| 图标 | Lucide React | 0.x |
| LLM SDK | OpenAI SDK | 1.x |

### 1.2 项目结构

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
└── docs/
    ├── prd.md
    ├── architecture.md
    ├── monaco-editor-guide.md
    └── project-guide.md
```

## 2. 核心模块详解

### 2.1 AI 服务客户端 (aiService.ts)

负责与云服务商 API 通信，支持多种服务商适配。

**关键功能：**
- 初始化 OpenAI 客户端
- 支持多种云服务商（OpenAI、阿里云、腾讯云、字节跳动）
- 提供聊天接口（流式和非流式）
- 提供代码补全接口

### 2.2 云服务商配置 (providers.ts)

定义支持的云服务商配置信息。

```typescript
interface CloudProvider {
  id: string;           // 服务商 ID
  name: string;         // 服务商名称
  baseUrl: string;      // API 基础 URL
  apiKeyHeader: string; // API Key 头部名称
  apiKeyPrefix: string; // API Key 前缀
  models: string[];     // 支持的模型列表
  chatEndpoint: string; // 聊天接口路径
}
```

### 2.3 状态管理

#### 2.3.1 SessionContext

管理会话状态，包括文件列表、当前文件、聊天历史。

**核心方法：**
- `addFile(name, content, language)` - 添加新文件
- `deleteFile(id)` - 删除文件
- `updateFile(id, content)` - 更新文件内容
- `renameFile(id, newName)` - 重命名文件
- `setCurrentFile(id)` - 设置当前编辑文件
- `addChatMessage(message)` - 添加聊天消息
- `clearChatHistory()` - 清空聊天历史

#### 2.3.2 SettingsContext

管理应用设置，包括 API 配置、AI 参数、编辑器设置。

**核心方法：**
- `updateSettings(settings)` - 更新设置
- `isConfigured` - 是否已配置 API Key

### 2.4 自定义 Hooks

#### 2.4.1 useCompletion

封装代码补全逻辑。

```typescript
const { getCompletion, loading, error, cancel } = useCompletion();
```

#### 2.4.2 useChat

封装聊天逻辑，支持流式响应。

```typescript
const { sendMessage, loading, error, cancel } = useChat();
```

### 2.5 UI 组件

#### 2.5.1 MonacoEditor

集成 Monaco Editor，支持：
- 语法高亮
- AI 代码补全
- 主题切换
- 字体大小调整

#### 2.5.2 ChatPanel

AI 聊天面板，支持：
- 流式响应显示
- Markdown 渲染
- 代码块复制
- 与当前文件关联

#### 2.5.3 FilePanel

文件管理面板，支持：
- 文件列表显示
- 新建/重命名/删除文件
- 文件切换

#### 2.5.4 SettingsPanel

设置面板，支持：
- 云服务商选择
- API Key 配置
- 模型选择
- AI 参数调整
- 编辑器设置

## 3. 数据流程

### 3.1 代码补全流程

```
用户输入 → 触发补全 → 提取上下文 → 调用 AI API → 返回补全建议 → 显示补全
```

### 3.2 聊天流程

```
用户输入 → 添加用户消息 → 构建上下文 → 调用 AI API → 流式返回 → 实时显示
```

### 3.3 文件管理流程

```
新建文件 → 添加到 session → 更新 localStorage → 渲染文件列表
编辑文件 → 更新 session → 更新 localStorage
删除文件 → 从 session 移除 → 更新 localStorage
```

## 4. 配置说明

### 4.1 API Key 配置

在设置面板中配置 API Key，支持以下服务商：

| 服务商 | API Key 获取地址 |
|--------|------------------|
| OpenAI | https://platform.openai.com/api-keys |
| 阿里云通义千问 | https://dashscope.console.aliyun.com/apiKey |
| 腾讯云混元 | https://console.cloud.tencent.com/cam/capi |
| 字节跳动火山引擎 | https://console.volcengine.com/ark/ |

### 4.2 AI 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| Temperature | 温度，控制输出随机性 | 0.7 |
| Max Tokens | 最大输出 Token 数 | 2048 |

### 4.3 编辑器设置

| 设置 | 说明 | 默认值 |
|------|------|--------|
| Font Size | 字体大小 | 14px |
| Theme | 主题 | Dark |

## 5. 开发指南

### 5.1 环境要求

- Node.js 18+
- npm 或 yarn

### 5.2 安装依赖

```bash
cd frontend
npm install
```

### 5.3 启动开发服务器

```bash
npm run dev
```

### 5.4 构建生产版本

```bash
npm run build
```

### 5.5 添加新功能

1. 在 `types/index.ts` 中定义类型
2. 创建组件或服务
3. 更新状态管理
4. 添加测试

## 6. 扩展指南

### 6.1 添加新的云服务商

在 `services/providers.ts` 中添加新的服务商配置：

```typescript
{
  id: 'new-provider',
  name: '新服务商',
  baseUrl: 'https://api.example.com/v1',
  apiKeyHeader: 'Authorization',
  apiKeyPrefix: 'Bearer ',
  models: ['model-1', 'model-2'],
  chatEndpoint: '/chat/completions'
}
```

### 6.2 添加新的编辑器语言

在 `components/MonacoEditor.tsx` 中的语言列表中添加：

```typescript
const languages = ['typescript', 'javascript', ..., 'new-language'];
```

### 6.3 添加新的功能组件

1. 在 `components/` 目录下创建新组件
2. 在 `App.tsx` 中引入并使用
3. 更新状态管理（如果需要）

## 7. 安全注意事项

- API Key 仅存储在浏览器 localStorage 中
- 前端直接调用云服务商 API，无需经过中间服务器
- 建议使用限额 API Key 以确保安全
- 不要在代码中硬编码 API Key

## 8. 常见问题

### 8.1 代码补全不工作

**原因**：未配置 API Key

**解决方案**：在设置面板中配置 API Key

### 8.2 聊天消息不显示

**原因**：API Key 无效或网络问题

**解决方案**：检查 API Key 是否正确，检查网络连接

### 8.3 编辑器内容丢失

**原因**：浏览器清除了 localStorage

**解决方案**：定期导出文件内容

### 8.4 构建失败

**原因**：依赖缺失或类型错误

**解决方案**：重新安装依赖，检查 TypeScript 类型错误

## 9. 资源链接

- [React 官方文档](https://react.dev/)
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Lucide React 文档](https://lucide.com/docs)

## 10. 学习路径

### 第一阶段：基础理解

1. 阅读 `README.md` 了解项目概览
2. 了解 `prd.md` 和 `architecture.md` 中的需求和架构
3. 运行项目，熟悉界面操作

### 第二阶段：核心模块

1. 学习 `types/index.ts` 中的类型定义
2. 理解 `context/` 中的状态管理
3. 学习 `services/` 中的 API 调用

### 第三阶段：深度开发

1. 理解 `components/` 中的组件实现
2. 学习 `hooks/` 中的自定义 Hooks
3. 尝试添加新功能

### 第四阶段：扩展优化

1. 添加新的云服务商支持
2. 优化代码补全算法
3. 改进 UI/UX