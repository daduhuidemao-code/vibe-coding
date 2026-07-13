import { OpenAI } from 'openai';
import { getProviderById } from './providers';
import { AppSettings, ChatRequest, ChatResponse } from '../types';

export class AIService {
  private client: OpenAI | null = null;
  private settings: AppSettings;

  constructor(settings: AppSettings) {
    this.settings = settings;
    this.initClient();
  }

  private initClient(): void {
    if (!this.settings.apiKey) {
      this.client = null;
      return;
    }

    const provider = getProviderById(this.settings.provider);
    if (!provider) {
      this.client = null;
      return;
    }

    const baseUrl = this.settings.provider === 'custom' 
      ? this.settings.customBaseUrl 
      : provider.baseUrl;

    if (!baseUrl) {
      this.client = null;
      return;
    }

    this.client = new OpenAI({
      apiKey: this.settings.apiKey,
      baseURL: baseUrl,
      defaultHeaders: {
        [provider.apiKeyHeader]: `${provider.apiKeyPrefix}${this.settings.apiKey}`
      }
    });
  }

  updateSettings(settings: AppSettings): void {
    this.settings = settings;
    this.initClient();
  }

  async getChatResponse(request: ChatRequest): Promise<ChatResponse> {
    if (!this.client) {
      throw new Error('AI 服务未配置');
    }

    const response = await this.client.chat.completions.create({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? this.settings.temperature,
      max_tokens: request.max_tokens ?? this.settings.maxTokens,
      stream: false
    });

    return {
      id: response.id,
      choices: response.choices.map(choice => ({
        message: {
          role: 'assistant',
          content: choice.message.content || ''
        }
      }))
    };
  }

  async *getChatStream(request: ChatRequest): AsyncGenerator<string> {
    if (!this.client) {
      throw new Error('AI 服务未配置');
    }

    const stream = await this.client.chat.completions.create({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? this.settings.temperature,
      max_tokens: request.max_tokens ?? this.settings.maxTokens,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  async getCompletions(prompt: string, language?: string): Promise<string> {
    if (!this.client) {
      throw new Error('AI 服务未配置');
    }

    const systemMessage = language 
      ? `你是一个专业的${language}代码助手。请根据用户提供的代码上下文，生成合适的代码补全。只返回代码，不要包含解释或其他文本。`
      : '你是一个专业的代码助手。请根据用户提供的代码上下文，生成合适的代码补全。只返回代码，不要包含解释或其他文本。';

    const response = await this.client.chat.completions.create({
      model: this.settings.model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `请补全以下代码：\n\n${prompt}` }
      ],
      temperature: 0.2,
      max_tokens: this.settings.maxTokens,
      stream: false
    });

    return response.choices[0]?.message?.content || '';
  }
}

let aiServiceInstance: AIService | null = null;

export const getAIService = (settings: AppSettings): AIService => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(settings);
  } else {
    aiServiceInstance.updateSettings(settings);
  }
  return aiServiceInstance;
};