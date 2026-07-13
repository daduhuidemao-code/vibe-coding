/**
 * 文件接口定义
 */
export interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

/**
 * 会话接口定义
 */
export interface Session {
  id: string;
  files: File[];
  currentFileId: string;
  createdAt: Date;
}

/**
 * 聊天消息接口定义
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

/**
 * 云服务商接口定义
 */
export interface CloudProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyHeader: string;
  apiKeyPrefix: string;
  models: string[];
  chatEndpoint: string;
}

/**
 * 应用设置接口定义
 */
export interface AppSettings {
  provider: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  theme: string;
  fontSize: number;
  customBaseUrl: string;
  customModels: string[];
}

/**
 * 代码补全请求接口定义
 */
export interface CompletionRequest {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
}

/**
 * 代码补全响应接口定义
 */
export interface CompletionResponse {
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

/**
 * 聊天请求接口定义
 */
export interface ChatRequest {
  model: string;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

/**
 * 聊天响应接口定义
 */
export interface ChatResponse {
  id: string;
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
  }[];
}

/**
 * 流式响应块接口定义
 */
export interface StreamChunk {
  id: string;
  choices: {
    delta: {
      content?: string;
    };
    finish_reason?: string;
  }[];
}