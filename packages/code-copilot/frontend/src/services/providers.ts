import { CloudProvider } from '../types';

export const providers: CloudProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer ',
    models: ['gpt-4o', 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    chatEndpoint: '/chat/completions'
  },
  {
    id: 'aliyun',
    name: '阿里云通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer ',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    chatEndpoint: '/chat/completions'
  },
  {
    id: 'tencent',
    name: '腾讯云混元',
    baseUrl: 'https://hunyuan.tencentcloudapi.com',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: '',
    models: ['hunyuan-pro', 'hunyuan-standard'],
    chatEndpoint: '/v1/chat/completions'
  },
  {
    id: 'bytedance',
    name: '字节跳动火山引擎',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer ',
    models: ['doubao-3-5'],
    chatEndpoint: '/chat/completions'
  },
  {
    id: 'custom',
    name: '自定义 API',
    baseUrl: '',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer ',
    models: [],
    chatEndpoint: '/chat/completions'
  }
];

export const getProviderById = (id: string): CloudProvider | undefined => {
  return providers.find(p => p.id === id);
};