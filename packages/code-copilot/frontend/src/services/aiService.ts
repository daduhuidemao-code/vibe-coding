import { OpenAI } from 'openai';
import { getProviderById } from './providers';
import { AppSettings, ChatRequest, ChatResponse } from '../types';

/**
 * AI 服务类，负责与云服务商 API 通信
 * 
 * @class AIService
 * @description 封装 OpenAI SDK，支持多种云服务商适配，提供聊天和代码补全功能
 */
export class AIService {
  /** OpenAI 客户端实例 */
  private client: OpenAI | null = null;
  
  /** 当前应用设置 */
  private settings: AppSettings;

  /**
   * 构造函数
   * 
   * @param {AppSettings} settings - 应用设置，包含 API Key、模型等配置
   */
  constructor(settings: AppSettings) {
    this.settings = settings;
    this.initClient();
  }

  /**
   * 初始化 OpenAI 客户端
   * 
   * @private
   * @description 根据配置初始化 OpenAI 客户端，支持自定义云服务商
   */
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

  /**
   * 更新设置并重新初始化客户端
   * 
   * @param {AppSettings} settings - 新的应用设置
   */
  updateSettings(settings: AppSettings): void {
    this.settings = settings;
    this.initClient();
  }

  /**
   * 获取聊天响应（非流式）
   * 
   * @param {ChatRequest} request - 聊天请求，包含模型、消息列表等
   * @returns {Promise<ChatResponse>} 聊天响应，包含 AI 生成的消息
   * @throws {Error} 如果 AI 服务未配置
   */
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

  /**
   * 获取聊天流式响应
   * 
   * @param {ChatRequest} request - 聊天请求，包含模型、消息列表等
   * @returns {AsyncGenerator<string>} 流式响应生成器，逐字返回 AI 生成的内容
   * @throws {Error} 如果 AI 服务未配置
   */
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

  /**
   * 获取代码补全
   * 
   * @param {string} prompt - 代码上下文，用于生成补全建议
   * @param {string} [language] - 编程语言，用于生成更精准的补全
   * @returns {Promise<string>} AI 生成的代码补全内容
   * @throws {Error} 如果 AI 服务未配置
   */
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

/** AI 服务单例实例 */
let aiServiceInstance: AIService | null = null;

/**
 * 获取 AI 服务单例
 * 
 * @param {AppSettings} settings - 应用设置
 * @returns {AIService} AI 服务实例
 */
export const getAIService = (settings: AppSettings): AIService => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(settings);
  } else {
    aiServiceInstance.updateSettings(settings);
  }
  return aiServiceInstance;
};