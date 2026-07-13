export interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

export interface Session {
  id: string;
  files: File[];
  currentFileId: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface CloudProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyHeader: string;
  apiKeyPrefix: string;
  models: string[];
  chatEndpoint: string;
}

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

export interface CompletionRequest {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
}

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

export interface ChatResponse {
  id: string;
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
  }[];
}

export interface StreamChunk {
  id: string;
  choices: {
    delta: {
      content?: string;
    };
    finish_reason?: string;
  }[];
}